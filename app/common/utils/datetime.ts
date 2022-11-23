declare global {
  interface Date {
    addDays(days: number): Date;
    addMonths(months: number): Date;
    getDayName: (short?: boolean) => string;
    getMonthName: (short?: boolean) => string;
  }
}

Date.prototype.getDayName = function (short: boolean = false) {
  return this.toLocaleDateString('en', { weekday: short ? 'short' : 'long' });
};

Date.prototype.getMonthName = function (short: boolean = false) {
  return this.toLocaleDateString('en', { month: short ? 'short' : 'long' });
};

Date.prototype.addDays = function (days: number): Date {
  return new Date(this.getTime() + 86400000 * days);
};

Date.prototype.addMonths = function (months: number): Date {
  const newDate = new Date(this);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

export enum DateTimeFormats {
  short = 'DD MMM',
  long = 'DD MMM YYYY',
  timeFull = 'HH:mm',
  time12Hour = 'hh:mm A',
}
