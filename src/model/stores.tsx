import {Instance, types} from "mobx-state-tree";
import moment from "moment";
import {BusinessNature, BusinessType, PageType} from "./enums";
import {IncomeTaxScale} from "./income-tax-scale";

export const AEBusinessStore = types.model({
      type: types.enumeration(Object.values(BusinessType)),
      nature: types.enumeration('BusinessNature', Object.values(BusinessNature))
    }
).views(self => ({
      get taxeableIncomePercent(): number {
        if (self.type === (BusinessType.BUY_SELL || BusinessType.FURNISHED_RENTAL_CLASSED_FOR_TOURISM)) return (1 - 0.71);
        if (self.nature === 'BIC') return 0.5;
        else return (1 - 0.34);
      },
      get socialCharges(): number {
        if (self.type === BusinessType.BUY_SELL) return 0.128;
        if (self.type === BusinessType.FURNISHED_RENTAL_CLASSED_FOR_TOURISM) return 0.06;
        else return 0.22;
      },
      get vflRate(): number {
        if (self.type.BUY_SELL) return 0.01;
        if (self.nature === 'BIC') return 0.017;
        else return 0.022;
      }
    })
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
  creationDate: new Date()
})
.actions(self => ({
      setCreationDate(newCreationDate: Date) {
        self.creationDate = newCreationDate;
      }
    })
)
.views(self => ({
  get isFirstYear(): boolean {
    return moment(self.creationDate).year() === moment().year();
  },
  get isSecondYear(): boolean {
    return moment(self.creationDate).add(1, 'years').year() === moment().year();
  },
  get isThirdYear(): boolean {
    return moment(self.creationDate).add(2, 'years').year() === moment().year();
  },
  get creationDayOfTheYear(): number {
    return moment(self.creationDate).dayOfYear();
  }
}));

export const AEStore = types.model({
  legalYear: '2019',
  financialData: types.optional(FinancialStore, {}),
  companyData: types.optional(CompanyStore, {}),
  businessType: types.optional(types.enumeration('BusinessType', Object.values(BusinessType)),
      BusinessType.SERVICES_LIBERAL),
  hasVFL: false,
  hasACCRE: false,
  businesses: types.optional(types.array(AEBusinessStore), [
    AEBusinessStore.create({
      type: BusinessType.BUY_SELL,
      nature: BusinessNature.BIC
    }),
    AEBusinessStore.create({
      type: BusinessType.FURNISHED_RENTAL_CLASSED_FOR_TOURISM,
      nature: BusinessNature.BIC
    }),
    AEBusinessStore.create({
      type: BusinessType.SERVICES_LIBERAL,
      nature: BusinessNature.BNC
    }),
    AEBusinessStore.create({
      type: BusinessType.RENTAL,
      nature: BusinessNature.BIC
    })
  ])
})
.actions(self => ({
      setOptionVFL(newHasVFL: boolean) {
        self.hasVFL = newHasVFL;
      },
      setOptionACCRE(newHasACCRE: boolean) {
        self.hasACCRE = newHasACCRE;
      },
      selectBusiness(businessType: BusinessType) {
        self.businessType = businessType;
      }
    })
)
.views(self => {
      const businessData = function (): Instance<typeof AEBusinessStore> {
        const business = self.businesses.find(business => business.type === self.businessType);
        if (business) return business;
        throw Error('Unsupported Business Type');
      };

      const averageIncomeTaxRate = function (): number {
        if (self.hasVFL) {
          return businessData().vflRate;
        } else if (self.financialData.annualRevenueWithoutTaxes > 0) {
          return incomeTaxForYear() / self.financialData.annualRevenueWithoutTaxes;
        } else {
          return 0;
        }
      };

      const socialChargesRate = function (): number {
        return self.hasACCRE ? accreMultiplier() * businessData().socialCharges : businessData().socialCharges;
      };
      const socialChargesForYear = function (): number {
        return self.financialData.annualRevenueWithoutTaxes * socialChargesRate();
      };

      const profitsAfterSocialCharges = function () {
        return self.financialData.profits - socialChargesForYear();
      };

      const accreMultiplier = function(): number {
        if (self.companyData.isFirstYear) {
          return 0.25;
        }
        if (self.companyData.isSecondYear) {
          return 0.5;
        }
        if (self.companyData.isThirdYear) {
          return 0.75;
        }
        return 1;
      };

      const taxeableIncome = function (): number {
        if (self.hasVFL) return self.financialData.annualRevenueWithoutTaxes;
        return self.financialData.annualRevenueWithoutTaxes * businessData().taxeableIncomePercent;
      };

      const incomeTaxForYear = function (): number {
        if (self.hasVFL) {
          return businessData().vflRate * self.financialData.annualRevenueWithoutTaxes;
        } else {
          return IncomeTaxScale.computeIncomeTax(taxeableIncome());
        }
      };

      const profitsAfterSocialChargesAndIncomeTax = function () {
        return profitsAfterSocialCharges() - incomeTaxForYear();
      };

      return {
        socialChargesRate, socialChargesForYear, incomeTaxForYear,
        taxeableIncome, businessData, averageIncomeTaxRate, profitsAfterSocialCharges,
        profitsAfterSocialChargesAndIncomeTax, accreMultiplier
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