export class IncomeTaxScale {
  private static readonly firstScale = 10064;
  private static readonly firstScaleRate = 0;
  private static readonly secondScale = 25659;
  private static readonly secondScaleRate = 0.11;
  private static readonly thirdScale = 73369;
  private static readonly thirdScaleRate = 0.3;
  private static readonly fourthScale = 157806;
  private static readonly fourthScaleRate = 0.41;
  private static readonly beyondRate = 0.45;

  public static computeIncomeTax(taxeableIncome: number): number {
    let incomeTax = 0;

    if (taxeableIncome < IncomeTaxScale.firstScale) {
      incomeTax += taxeableIncome * IncomeTaxScale.firstScaleRate;
      return incomeTax;
    } else {
      incomeTax += IncomeTaxScale.firstScale * IncomeTaxScale.firstScaleRate;
    }

    if (taxeableIncome < IncomeTaxScale.secondScale) {
      incomeTax += (taxeableIncome - IncomeTaxScale.firstScale) * IncomeTaxScale.secondScaleRate;
      return incomeTax;
    } else {
      incomeTax += (IncomeTaxScale.secondScale - IncomeTaxScale.firstScale) * IncomeTaxScale.secondScaleRate;
    }

    if (taxeableIncome < IncomeTaxScale.thirdScale) {
      incomeTax += (taxeableIncome - IncomeTaxScale.secondScale) * IncomeTaxScale.thirdScaleRate;
      return incomeTax;
    } else {
      incomeTax += (IncomeTaxScale.thirdScale - IncomeTaxScale.secondScale) * IncomeTaxScale.thirdScaleRate;
    }

    if (taxeableIncome < IncomeTaxScale.fourthScale) {
      incomeTax += (taxeableIncome - IncomeTaxScale.thirdScale) * IncomeTaxScale.fourthScaleRate;
      return incomeTax;
    } else {
      incomeTax = (IncomeTaxScale.fourthScale - IncomeTaxScale.thirdScale) * IncomeTaxScale.fourthScaleRate;
    }
    incomeTax += (taxeableIncome - IncomeTaxScale.fourthScale) * IncomeTaxScale.beyondRate;

    return incomeTax;
  }
}