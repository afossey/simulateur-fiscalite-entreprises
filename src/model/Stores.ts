import {Instance, types} from "mobx-state-tree";
import moment from "moment";
import {BusinessNature, BusinessType, CompanyLegalStatus, PageType} from "./Enums";
import {IncomeTaxScale} from "./IncomeTaxScale";

export const BusinessStore = types.model({
      type: types.enumeration(Object.values(BusinessType)),
      nature: types.enumeration('BusinessNature', Object.values(BusinessNature))
    }
);

export const FinancialStore = types.model({
  annualRevenueWithoutTaxes: 0,
  charges: 0
})
.actions(self => ({
      setAnnualRevenueWithoutTaxes(newAnnualRevenueWithoutTaxes: number) {
        self.annualRevenueWithoutTaxes = newAnnualRevenueWithoutTaxes;
      },
      setCharges(newCharges: number) {
        self.charges = newCharges;
      }
    })
)
.views(self => ({
  get profits(): number {
    return self.annualRevenueWithoutTaxes - self.charges;
  }
}));

export const CompanyStore = types.model({
  creationDate: new Date('2020/01/01'),
  legalStatus: types.optional(types.enumeration('CompanyLegalStatus', Object.values(CompanyLegalStatus)),
      CompanyLegalStatus.AE),
  businessType: types.optional(types.enumeration('BusinessType', Object.values(BusinessType)),
      BusinessType.SERVICES_LIBERAL),
  businesses: types.optional(types.array(BusinessStore), [
    BusinessStore.create({
      type: BusinessType.BUY_SELL,
      nature: BusinessNature.BIC
    }),
    BusinessStore.create({
      type: BusinessType.FURNISHED_RENTAL_CLASSED_FOR_TOURISM,
      nature: BusinessNature.BIC
    }),
    BusinessStore.create({
      type: BusinessType.SERVICES_LIBERAL,
      nature: BusinessNature.BNC
    }),
    BusinessStore.create({
      type: BusinessType.RENTAL,
      nature: BusinessNature.BIC
    })
  ]),
  finance: types.optional(FinancialStore, {}),
  hasVFL: false,
  hasACCRE: true
})
.actions(self => ({
      setCreationDate(newCreationDate: Date) {
        self.creationDate = newCreationDate;
      },
      selectBusiness(businessType: BusinessType) {
        if(self.businesses.find(business => business.type === businessType))
          self.businessType = businessType;
      },
      setOptionVFL(newHasVFL: boolean) {
        self.hasVFL = newHasVFL;
      },
      setOptionACCRE(newHasACCRE: boolean) {
        self.hasACCRE = newHasACCRE;
      }
    })
)
.views( self => ({
  get business(): Instance<typeof BusinessStore> {
    const business = self.businesses.find(business => business.type === self.businessType);
    if(business) return business;
    throw Error('Unsupported Business Type');
  },
  get creationDayOfTheYear(): number {
    return moment(self.creationDate).dayOfYear() - 1;
  },
  get isFirstYear(): boolean {
    return moment(self.creationDate).year() === moment().year();
  },
  get isSecondYear(): boolean {
    return moment(self.creationDate).add(1, 'years').year() === moment().year();
  },
  get isThirdYear(): boolean {
    return moment(self.creationDate).add(2, 'years').year() === moment().year();
  }
}))
.views(self => ({
  get averageRemainingMonths(): number {
    if (self.isFirstYear) return 12 - (self.creationDayOfTheYear / 365) * 12;
    else return 12;
  },
  get taxeableIncomePercent(): number {
    if (self.business.type === (BusinessType.BUY_SELL || BusinessType.FURNISHED_RENTAL_CLASSED_FOR_TOURISM)) return (1 - 0.71);
    if (self.business.nature === BusinessNature.BIC) return 0.5;
    else return (1 - 0.34);
  },
  get socialCharges(): number {
    if (self.business.type === BusinessType.BUY_SELL) return 0.128;
    if (self.business.type === BusinessType.FURNISHED_RENTAL_CLASSED_FOR_TOURISM) return 0.06;
    else return 0.22;
  },
  get vflRate(): number {
    if (self.business.type.BUY_SELL) return 0.01;
    if (self.business.nature === 'BIC') return 0.017;
    else return 0.022;
  },
  get grossAnnualRevenueThreshold(): number {
    if(self.business.type === (BusinessType.BUY_SELL || BusinessType.FURNISHED_RENTAL_CLASSED_FOR_TOURISM)) {
      return 170000;
    } else {
      return 70000;
    }
  },
  get tvaThreshold(): number {
    if(self.business.type === (BusinessType.BUY_SELL || BusinessType.FURNISHED_RENTAL_CLASSED_FOR_TOURISM)) {
      return 82800;
    } else {
      return 33200;
    }
  },
}));

export const SimulatorStore = types.model({
  legalYear: '2020',
  company: types.optional(CompanyStore, {}),
})
.views(self => {

    const averageIncomeTaxRate = function (): number {
      if (self.company.hasVFL) {
        return self.company.vflRate;
      } else if (self.company.finance.annualRevenueWithoutTaxes > 0) {
        return incomeTaxForYear() /taxeableIncome();
      } else {
        return 0;
      }
    };

    const socialChargesRate = function (): number {
      if (self.company.finance.annualRevenueWithoutTaxes === 0) {
        return 0;
      }
      return socialChargesForYear() / self.company.finance.annualRevenueWithoutTaxes;
    };

    const socialChargesForYear = function (): number {
      const annualRevenue = self.company.finance.annualRevenueWithoutTaxes;
      if (self.company.hasACCRE) {
        const reducedSocialCharges = accreMultiplier() * self.company.socialCharges;
        return annualRevenue * reducedSocialCharges;
      }
      return annualRevenue * self.company.socialCharges;
    };

    const profitsAfterSocialCharges = function () {
      return self.company.finance.profits - socialChargesForYear();
    };

    const accreMultiplier = function(): number {
      if (self.company.isFirstYear) {
        return 0.5;
      }
      if (self.company.isSecondYear) {
        return 0.75;
      }
      if (self.company.isThirdYear) {
        return 0.9;
      }
      return 1;
    };

    const grossAnnualIncomeProrataTemporisThreshold = function(): number {
      if(self.company.isFirstYear) {
        const dayCountInYear = 365;
        return ((dayCountInYear - self.company.creationDayOfTheYear) * self.company.grossAnnualRevenueThreshold) / dayCountInYear;
      } else {
        return self.company.grossAnnualRevenueThreshold;
      }
    };

    const taxeableIncome = function (): number {
      if (self.company.hasVFL) return self.company.finance.annualRevenueWithoutTaxes;
      return self.company.finance.annualRevenueWithoutTaxes * self.company.taxeableIncomePercent;
    };

    const incomeTaxForYear = function (): number {
      if (self.company.hasVFL) {
        return self.company.vflRate * self.company.finance.annualRevenueWithoutTaxes;
      } else {
        return IncomeTaxScale.computeIncomeTax(taxeableIncome());
      }
    };

    const diffBetweenVFLAndRegularIncomeTax = function (): number {
        return self.company.vflRate * self.company.finance.annualRevenueWithoutTaxes - IncomeTaxScale.computeIncomeTax(taxeableIncome());
    };

    const profitsAfterSocialChargesAndIncomeTax = function () {
      return profitsAfterSocialCharges() - incomeTaxForYear();
    };

    const hasCrossedTvaThreshold = function(): boolean {
      return self.company.finance.annualRevenueWithoutTaxes > self.company.tvaThreshold;
    };

    const hasCrossedGrossAnnualRevenueThresholdProrataTemporis = function(): boolean {
      return self.company.finance.annualRevenueWithoutTaxes > grossAnnualIncomeProrataTemporisThreshold();
    };

    return {
      socialChargesRate, socialChargesForYear, incomeTaxForYear,
      taxeableIncome, averageIncomeTaxRate, profitsAfterSocialCharges,
      profitsAfterSocialChargesAndIncomeTax, accreMultiplier, hasCrossedTvaThreshold,
      hasCrossedGrossAnnualRevenueThresholdProrataTemporis, grossAnnualIncomeProrataTemporisThreshold,
      diffBetweenVFLAndRegularIncomeTax
    };
  }
);

export const AppStore = types.model({
  currentPage: types.enumeration('PageType', Object.values(PageType))
})
.actions(
    self => ({
      setCurrentPage(pageType: PageType) {
        self.currentPage = pageType;
      }
    })
);