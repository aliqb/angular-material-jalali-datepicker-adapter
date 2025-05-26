import { inject } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { JalaliDateService } from './jalali-date.service';
import { PERSIAN_DATE_FORMATS } from './date-format';

export class MaterialPersianDateAdapter extends DateAdapter<Date> {
  dateService = inject(JalaliDateService);

  getYear(date: Date): number {
    return this.dateService.getYear(date);
  }

  getMonth(date: Date): number {
    return this.dateService.getMonth(date);
  }

  getDate(date: Date): number {
    return this.dateService.getDate(date);
  }

  getDayOfWeek(date: Date): number {
    // Convert JS day (0=Sun, 6=Sat) to Persian (0=Sat, 6=Fri)
    return (date.getDay() + 1) % 7;
  }

  getMonthNames(_style: 'long' | 'short' | 'narrow'): string[] {
    return this.dateService.monthNames;
  }

  getDateNames(): string[] {
    return Array.from({ length: 31 }, (_, i) => String(i + 1));
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    return this.dateService.dayNames[style];
  }

  getYearName(date: Date): string {
    return this.getYear(date).toString();
  }

  getFirstDayOfWeek(): number {
    return 0; // Saturday is first day
  }

  getNumDaysInMonth(date: Date): number {
    const year = this.getYear(date);
    const month = this.getMonth(date);

    // First day of next month
    const nextMonth = this.createDate(
      month === 11 ? year + 1 : year,
      month === 11 ? 0 : month + 1,
      1
    );

    // Last day of current month
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
    return this.dateService.parse(value, parseFormat);
  }

  format(date: Date, displayFormat: string): string {
    return this.dateService.format(date, displayFormat);
  }

  addCalendarYears(date: Date, years: number): Date {
    const pYear = this.getYear(date);
    const pMonth = this.getMonth(date);
    const pDay = this.getDate(date);
    return this.createDate(pYear + years, pMonth, pDay);
  }

  addCalendarMonths(date: Date, months: number): Date {
    const pYear = this.getYear(date);
    const pMonth = this.getMonth(date);
    const pDay = this.getDate(date);

    const totalMonths = pMonth + months;
    const newYear = pYear + Math.floor(totalMonths / 12);
    const newMonth =
      totalMonths < 0 ? 12 + (totalMonths % 12) : totalMonths % 12;

    // Handle month overflow by adjusting day if needed
    const maxDay = this._getMaxDayInMonth(newYear, newMonth);
    const adjustedDay = Math.min(pDay, maxDay);

    return this.createDate(newYear, newMonth, adjustedDay);
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
    if (!value) return null;

    if (typeof value === 'string') {
      return this.parse(value, PERSIAN_DATE_FORMATS.parse.dateInput);
    }

    if (typeof value === 'number') {
      return new Date(value);
    }

    if (this.isDateInstance(value)) {
      return this.clone(value);
    }

    return null;
  }

  private _getMaxDayInMonth(year: number, month: number): number {
    // Persian calendar: first 6 months have 31 days, next 5 have 30, last has 29/30
    if (month < 6) return 31;
    if (month < 11) return 30;

    // Check if leap year for last month
    const testDate = this.createDate(year, month, 1);
    const nextYear = this.createDate(year + 1, 0, 1);
    const daysBetween = Math.floor(
      (nextYear.getTime() - testDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysBetween > 29 ? 30 : 29;
  }
}
