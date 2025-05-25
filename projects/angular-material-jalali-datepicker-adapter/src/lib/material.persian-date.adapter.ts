import { inject } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { JalaliDateService } from './jalali-date.service';

export const PERSIAN_DATE_FORMATS = {
  parse: {
    dateInput: 'yyyy/MM/dd',
  },
  display: {
    dateInput: 'yyyy/MM/dd',
    monthYearLabel: 'yyyy MMMM',
    dateA11yLabel: 'yyyy/MM/dd',
    monthYearA11yLabel: 'yyyy MMMM',
  },
};
export class MaterialPersianDateAdapter extends DateAdapter<Date> {
  private _locale = 'fa-IR';
  private _calendar = 'persian';

  dateService  = inject(JalaliDateService)

  constructor() {
    super();
    this.setLocale(this._locale);
  }

  getYear(date: Date): number {
    return this.dateService.getYear(date)
  }

  getMonth(date: Date): number {
    return this.dateService.getMonth(date)
  }

  getDate(date: Date): number {
    return this.dateService.getDate(date)
  }

  getDayOfWeek(date: Date): number {
    // Persian week starts with Saturday (6) as the first day
    return (date.getDay() + 1) % 7;
  }

  getMonthNames(_style: 'long' | 'short' | 'narrow'): string[] {
    // Always return long month names regardless of the style parameter
    return this.dateService.monthNames
  }

  getDateNames(): string[] {
    // Return array of 1-31 as strings
    return Array.from({ length: 31 }, (_, i) => String(i + 1));
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    const days = [];
    const format = new Intl.DateTimeFormat(this._locale, {
      calendar: this._calendar,
      weekday:
        style === 'narrow' ? 'narrow' : style === 'short' ? 'short' : 'long',
    });

    // Create 7 dates, one for each day of the week
    // Start with 2017-01-01 (a Sunday)
    const baseDate = new Date(2017, 0, 1);
    for (let i = 0; i < 7; i++) {
      days.push(format.format(baseDate));
      baseDate.setDate(baseDate.getDate() + 1);
    }

    return days;
  }

  getYearName(date: Date): string {
    return new Intl.DateTimeFormat(this._locale, {
      calendar: this._calendar,
      year: 'numeric',
    }).format(date);
  }

  getFirstDayOfWeek(): number {
    return 6; // Saturday in Persian calendar
  }

  getNumDaysInMonth(date: Date): number {
    // Clone date to avoid modifying the original
    const clone = this.clone(date);

    // Set to the first day of the next month
    const year = this.getYear(clone);
    const month = this.getMonth(clone);

    // Set to first day of next month
    const nextMonth = this.createDate(
      month === 11 ? year + 1 : year,
      month === 11 ? 0 : month + 1,
      1
    );

    // Go back one day to get the last day of the current month
    const lastDay = this.addCalendarDays(nextMonth, -1);

    return this.getDate(lastDay);
  }

  clone(date: Date): Date {
    return new Date(date.getTime());
  }

  createDate(year: number, month: number, date: number): Date {
    const gregorian = this.dateService.toGregorian(year, month + 1, date);

    return new Date(gregorian.year, gregorian.month - 1, gregorian.date);
  }

  today(): Date {
    return new Date();
  }

  parse(value: any, parseFormat: string): Date | null {
    return this.dateService.parse(value, parseFormat)
  }

  format(date: Date, displayFormat: string): string {
    return this.dateService.format(date, displayFormat)
  }

  addCalendarYears(date: Date, years: number): Date {
    // Get current Persian date components
    const pYear = this.getYear(date);
    const pMonth = this.getMonth(date);
    const pDay = this.getDate(date);

    // Create new date with adjusted year
    return this.createDate(pYear + years, pMonth, pDay);
  }

  addCalendarMonths(date: Date, months: number): Date {
    // Get current Persian date components
    const pYear = this.getYear(date);
    const pMonth = this.getMonth(date);
    const pDay = this.getDate(date);

    // Calculate new month and year
    const totalMonths = pMonth + months;
    const newYear = pYear + Math.floor(totalMonths / 12);
    const newMonth = totalMonths % 12;

    // Handle negative values
    const adjustedNewMonth = newMonth < 0 ? 12 + newMonth : newMonth;

    // Try to create with same day, but adjust if needed
    try {
      return this.createDate(newYear, adjustedNewMonth, pDay);
    } catch (e) {
      // If day doesn't exist in the target month (e.g., 31 in a 30-day month)
      // Create date with last day of the target month
      const daysInMonth = this._getDaysInMonthInternal(
        newYear,
        adjustedNewMonth
      );
      return this.createDate(
        newYear,
        adjustedNewMonth,
        Math.min(pDay, daysInMonth)
      );
    }
  }

  addCalendarDays(date: Date, days: number): Date {
    const result = this.clone(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  toIso8601(date: Date): string {
    return date.toISOString();
  }

  isDateInstance(obj: any): boolean {
    return obj instanceof Date;
  }

  isValid(date: Date | null): boolean {
    return date !== null && date instanceof Date && !isNaN(date.getTime());
  }

  invalid(): Date {
    return new Date(NaN);
  }

  override deserialize(value: any): Date | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    if (typeof value === 'string') {
      return this.parse(value, PERSIAN_DATE_FORMATS.parse.dateInput);
    }

    if (typeof value === 'number') {
      return new Date(value);
    }

    return super.deserialize(value);
  }

  // Helper method to determine days in month
  private _getDaysInMonthInternal(year: number, month: number): number {
    const date = this.createDate(year, month, 1);
    let nextMonth = month + 1;
    let nextYear = year;

    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear++;
    }

    const nextMonthDate = this.createDate(nextYear, nextMonth, 1);
    const daysBetween = Math.floor(
      (nextMonthDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysBetween;
  }

  override setLocale(locale: string): void {
    super.setLocale(locale);
    this._locale = locale;
  }

}
