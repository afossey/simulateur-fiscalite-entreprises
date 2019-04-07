import {types} from "mobx-state-tree";
import moment from "moment";

export enum BusinessType {
  FURNISHED_RENTAL_CLASSED_FOR_TOURISM = 'FURNISHED_RENTAL_CLASSED_FOR_TOURISM',
  RENTAL = 'RENTAL',
  BUY_SELL = 'BUY_SELL',
  SERVICES_LIBERAL = 'SERVICES_LIBERAL'
}

export enum BusinessNature {
  BIC = 'BIC',
  BNC = 'BNC'
}

export const IncomeTaxScale = types.model({
      firstScale: 9964,
      firstScaleRate: 0,
      secondScale: 27519,
      secondScaleRate: 0.14,
      thirdScale: 73779,
      thirdScaleRate: 0.3,
      fourthScale: 156244,
      fourthScaleRate: 0.41,
      beyondRate: 0.45
    }
).views( self => ({
    computeIncomeTax(taxeableIncome: number): number {
      let incomeTax = 0;

      if(taxeableIncome < self.firstScale) {
        incomeTax += taxeableIncome * self.firstScaleRate;
        return incomeTax;
      } else {
        incomeTax += self.firstScale * self.firstScaleRate;
      }

      if(taxeableIncome < self.secondScale) {
        incomeTax += (taxeableIncome - self.firstScale) * self.secondScaleRate;
        return incomeTax;
      } else {
        incomeTax += (self.secondScale - self.firstScale) * self.secondScaleRate;
      }

      if(taxeableIncome < self.thirdScale) {
        incomeTax += (taxeableIncome - self.secondScale) * self.thirdScaleRate;
        return incomeTax;
      } else {
        incomeTax += (self.thirdScale - self.secondScale) * self.thirdScaleRate;
      }

      if(taxeableIncome < self.fourthScale) {
        incomeTax += (taxeableIncome - self.thirdScale) * self.fourthScaleRate;
        return incomeTax;
      } else {
        incomeTax = (self.fourthScale - self.thirdScale) * self.fourthScaleRate;
      }
      incomeTax += (taxeableIncome - self.fourthScale) * self.beyondRate;

      return incomeTax;
    }
}));

export const AEBusiness = types.model({
      type: types.enumeration(Object.values(BusinessType)),
      nature: types.enumeration('BusinessNature', Object.values(BusinessNature))
    }
).views(self => ({
      get taxeableIncomePercent(): number {
        if(self.type === (BusinessType.BUY_SELL || BusinessType.FURNISHED_RENTAL_CLASSED_FOR_TOURISM)) return (1 - 0.71);
        if(self.nature === 'BIC') return 0.5;
        else return (1- 0.34);
      },
      get socialCharges(): number {
        if(self.type === BusinessType.BUY_SELL) return 0.128;
        if(self.type === BusinessType.FURNISHED_RENTAL_CLASSED_FOR_TOURISM) return 0.06;
        else return 0.22;
      },
      get vflRate(): number {
        if(self.type.BUY_SELL) return 0.01;
        if(self.nature === 'BIC') return 0.017;
        else return 0.022;
      }
    })
);

export const Accre = types.model({
  firstYearMultiplier: 0.25,
  secondYearMultiplier: 0.5,
  thirdYearMultiplier: 0.75
});

export const AEConfig = types.model({
  // Legal year of the config
  effectiveYear: '2019',

  // ACCRE reduction rates
  accre: types.optional(Accre, {}),

  incomeTaxScale: types.optional(IncomeTaxScale, {}),

  // Possible businesses for AE
  businesses: types.optional(types.array(AEBusiness), [
    AEBusiness.create({
      type: BusinessType.BUY_SELL,
      nature: BusinessNature.BIC}),
    AEBusiness.create({
      type: BusinessType.FURNISHED_RENTAL_CLASSED_FOR_TOURISM,
      nature: BusinessNature.BIC}),
    AEBusiness.create({
      type: BusinessType.SERVICES_LIBERAL,
      nature: BusinessNature.BNC}),
    AEBusiness.create({
      type: BusinessType.RENTAL,
      nature: BusinessNature.BIC})
  ]),
});

export const FinancialData = types
  .model({
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

export const CompanyData = types
  .model( {
    creationDate: new Date()
  })
  .actions( self => ({
      setCreationDate(newCreationDate: Date) {
        self.creationDate = newCreationDate;
      }
    })
  )
  .views( self => ({
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

export const AEStore = types
  .model( {
    financialData: types.optional(FinancialData, {}),
    companyData: types.optional(CompanyData, {}),
    businessType: types.optional(types.enumeration('BusinessType', Object.values(BusinessType)),
        BusinessType.SERVICES_LIBERAL),
    hasVFL: false,
    hasACCRE: false,
    config: types.optional(AEConfig, {})
  })
  .actions( self => ({
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
      const businessData = function(): any {
        const business = self.config.businesses.find(business => business.type === self.businessType);
        if(business) return business;
        throw Error('Unsupported Business Type');
      };

      const averageIncomeTaxRate = function(): number {
        if(self.hasVFL) {
          return businessData().vflRate;
        } else if(self.financialData.annualRevenueWithoutTaxes > 0) {
          return incomeTaxForYear() / self.financialData.annualRevenueWithoutTaxes;
        } else {
          return 0;
        }
      };

      const socialChargesRate = function(): number {
        return self.hasACCRE ? accreSocialCharges() : businessData().socialCharges;
      };
      const socialChargesForYear = function(): number {
        if(self.hasACCRE) {
          return self.financialData.annualRevenueWithoutTaxes * accreSocialCharges();
        } else {
          return self.financialData.annualRevenueWithoutTaxes * businessData().socialCharges;
        }
      };

      const profitsAfterSocialCharges = function() {
        return self.financialData.profits - socialChargesForYear();
      };

      const accreSocialCharges = function(): number {
          if(self.companyData.isFirstYear) {
            return self.config.accre.firstYearMultiplier * businessData().socialCharges;
          }
          if(self.companyData.isSecondYear) {
            return self.config.accre.secondYearMultiplier * businessData().socialCharges;
          }
          if(self.companyData.isThirdYear) {
            return self.config.accre.thirdYearMultiplier * businessData().socialCharges;
          }
          return businessData().socialCharges;
      };

      const taxeableIncome = function(): number {
        if(self.hasVFL) return self.financialData.annualRevenueWithoutTaxes;
        return self.financialData.annualRevenueWithoutTaxes * businessData().taxeableIncomePercent;
      };

      const incomeTaxForYear = function(): number {
         if(self.hasVFL) {
           return businessData().vflRate * self.financialData.annualRevenueWithoutTaxes;
         } else {
           return self.config.incomeTaxScale.computeIncomeTax(taxeableIncome());
         }
      };

      const profitsAfterSocialChargesAndIncomeTax = function() {
        return profitsAfterSocialCharges() - incomeTaxForYear();
      };

      return { socialChargesRate, socialChargesForYear, accreSocialCharges, incomeTaxForYear,
        taxeableIncome, businessData, averageIncomeTaxRate, profitsAfterSocialCharges,
        profitsAfterSocialChargesAndIncomeTax };
    }
  );