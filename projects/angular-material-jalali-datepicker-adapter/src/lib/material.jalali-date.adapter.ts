import { inject } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { JalaliDateService } from './jalali-date.service';
import { JALALI_DATE_FORMATS } from './date-format';

export class MaterialJalaliDateAdapter extends DateAdapter<Date> {
  private readonly dateService = inject(JalaliDateService);

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
    // Cache the array since it's static
    return this._dateNames ||= Array.from({ length: 31 }, (_, i) => String(i + 1));
  }
  private _dateNames?: string[];

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    return [...this.dateService.dayNames[style]];
  }

  getYearName(date: Date): string {
    return this.getYear(date).toString();
  }

  getFirstDayOfWeek(): number {
    return 0; // Saturday is first day in Persian calendar
  }

  getNumDaysInMonth(date: Date): number {
    const year = this.getYear(date);
    const month = this.getMonth(date) + 1; // Convert to 1-based
    return this.dateService.getDaysInMonth(year, month);
  }

  clone(date: Date): Date {
    return new Date(date.getTime());
  }

  createDate(year: number, month: number, date: number): Date {
    // Validate input parameters
    if (!this.isValidJalaliInput(year, month + 1, date)) {
      return this.invalid();
    }

    try {
      const gregorian = this.dateService.toGregorian(year, month + 1, date);
      const result = new Date(gregorian.year, gregorian.month - 1, gregorian.date);
      return this.isValid(result) ? result : this.invalid();
    } catch {
      return this.invalid();
    }
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
    if (!this.isValid(date)) return this.invalid();

    try {
      return this.dateService.addYears(date, years);
    } catch {
      return this.invalid();
    }
  }

  addCalendarMonths(date: Date, months: number): Date {
    if (!this.isValid(date)) return this.invalid();

    try {
      return this.dateService.addMonths(date, months);
    } catch {
      return this.invalid();
    }
  }

  addCalendarDays(date: Date, days: number): Date {
    if (!this.isValid(date)) return this.invalid();

    try {
      return this.dateService.addDays(date, days);
    } catch {
      const result = this.clone(date);
      result.setDate(result.getDate() + days);
      return result;
    }
  }

  toIso8601(date: Date): string {
    return date.toISOString();
  }

  isDateInstance(obj: any): boolean {
    return obj instanceof Date;
  }

  isValid(date: Date | null): boolean {
    return this.dateService.isValid(date);
  }

  invalid(): Date {
    return new Date(NaN);
  }

  override deserialize(value: any): Date | null {
    if (value == null || value === '') {
      return null;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed ? this.parse(trimmed, JALALI_DATE_FORMATS.parse.dateInput) : null;
    }

    if (typeof value === 'number' && !isNaN(value)) {
      const date = new Date(value);
      return this.isValid(date) ? date : null;
    }

    if (this.isDateInstance(value)) {
      return this.isValid(value) ? this.clone(value) : null;
    }

    return null;
  }

  // Helper method for input validation
  private isValidJalaliInput(year: number, month: number, day: number): boolean {
    return (
      Number.isInteger(year) && year > 0 && year <= 3178 &&
      Number.isInteger(month) && month >= 1 && month <= 12 &&
      Number.isInteger(day) && day >= 1 && day <= 31
    );
  }
}