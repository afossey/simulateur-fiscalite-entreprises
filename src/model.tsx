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
  firstYearMultiplier: 0.75,
  secondYearMultiplier: 0.5,
  thirdYearMultiplier: 0.25
});

export const AEConfig = types.model({
  // Legal year of the config
  effectiveYear: types.string,

  // ACCRE reduction rates
  accre: types.optional(Accre, {}),

  incomeTaxScale: types.optional(IncomeTaxScale, {}),

  // Possible businesses for AE
  businesses: types.array(AEBusiness),
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
  );

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
    businessData: AEBusiness,
    hasVFL: false,
    hasACCRE: false,
    config: AEConfig
  })
  .actions( self => ({
        setOptionVFL(newHasVFL: boolean) {
          self.hasVFL = newHasVFL;
        },
        setOptionACCRE(newHasACCRE: boolean) {
          self.hasACCRE = newHasACCRE;
        },
        selectBusiness(businessType: BusinessType) {
          const business = self.config.businesses.find(business => business.type === businessType);
          if(business) self.businessData = business;
          else console.error('Unsupported Business Type');
        }
      })
  )
  .views(self => {
      const socialChargesForYear = function(): number {
        if(self.hasACCRE) {
          return self.financialData.annualRevenueWithoutTaxes * accreSocialCharges();
        } else {
          return self.financialData.annualRevenueWithoutTaxes * self.businessData.socialCharges;
        }
      };
      const accreSocialCharges = function(): number {
          if(self.companyData.isFirstYear) {
            return self.config.accre.firstYearMultiplier * self.businessData.socialCharges;
          }
          if(self.companyData.isSecondYear) {
            return self.config.accre.secondYearMultiplier * self.businessData.socialCharges;
          }
          if(self.companyData.isThirdYear) {
            return self.config.accre.thirdYearMultiplier * self.businessData.socialCharges;
          }
          return self.businessData.socialCharges;
      };
      const taxeableIncome = function(): number {
        return self.financialData.annualRevenueWithoutTaxes * self.businessData.taxeableIncomePercent;
      };
      const incomeTaxForYear = function(): number {
         if(self.hasVFL) {
           return self.businessData.vflRate * self.financialData.annualRevenueWithoutTaxes;
         } else {
           return self.config.incomeTaxScale.computeIncomeTax(taxeableIncome());
         }
      };
      return { socialChargesForYear, accreSocialCharges, incomeTaxForYear, taxeableIncome};
    }
  );