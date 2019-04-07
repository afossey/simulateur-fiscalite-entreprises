export class Commons {
  public static getPercentLabel = (value: number) => ( Math.round(value * 1000) / 10) + '%';
  public static getEuroAmountLabel = (value: number) => ( Math.round(value * 100) / 100) + ' €';
}