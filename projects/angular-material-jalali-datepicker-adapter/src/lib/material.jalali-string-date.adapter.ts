import { inject } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { JalaliDateService } from './jalali-date.service';
import { JALALI_DATE_FORMATS } from './date-format';

export class MaterialJalaliStringDateAdapter extends DateAdapter<string> {
  override invalid(): string {
    return 'INVALID_DATE';
  }
  
  dateService = inject(JalaliDateService);

  private getDateParts(date: string): { year: number; month: number; day: number } {
    if (!date || typeof date !== 'string') {
      throw new Error('Invalid date string');
    }
    
    const parts = date.split('/');
    if (parts.length !== 3) {
      throw new Error('Invalid date format');
    }
    
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Convert to 0-based
    const day = parseInt(parts[2], 10);
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      throw new Error('Invalid date components');
    }
    
    return { year, month, day };
  }

  getYear(date: string): number {
    return this.getDateParts(date).year;
  }

  getMonth(date: string): number {
    return this.getDateParts(date).month;
  }

  getDate(date: string): number {
    return this.getDateParts(date).day;
  }

  getDayOfWeek(date: string): number {
    const dateObj = this.dateService.parse(date, JALALI_DATE_FORMATS.parse.dateInput);
    if (!dateObj) return 0;
    // Convert JS day (0=Sun, 6=Sat) to Persian (0=Sat, 6=Fri)
    return (dateObj.getDay() + 1) % 7;
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

  getYearName(date: string): string {
    return this.getYear(date).toString();
  }

  getFirstDayOfWeek(): number {
    return 0; // Saturday is first day
  }

  getNumDaysInMonth(date: string): number {
    const { year, month } = this.getDateParts(date);
    return this._getMaxDayInMonth(year, month);
  }

  clone(date: string): string {
    return date;
  }

  createDate(year: number, month: number, date: number): string {
    // Ensure valid ranges
    const validYear = Math.max(1, year);
    const validMonth = Math.max(0, Math.min(11, month));
    const maxDays = this._getMaxDayInMonth(validYear, validMonth);
    const validDate = Math.max(1, Math.min(maxDays, date));
    
    return `${validYear}/${(validMonth + 1).toString().padStart(2, '0')}/${validDate.toString().padStart(2, '0')}`;
  }

  today(): string {
    const today = new Date();
    return this.dateService.format(today, JALALI_DATE_FORMATS.parse.dateInput);
  }

  parse(value: any, parseFormat: string): string | null {
    if (!value) return null;
    
    if (typeof value === 'string') {
      // If it's already in the correct format, validate and return as-is
      if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(value)) {
        const dateObj = this.dateService.parse(value, parseFormat);
        return dateObj ? value : null;
      }
    }
    
    if (typeof value === 'number') {
      const dateObj = new Date(value);
      if (this.dateService.isValid(dateObj)) {
        return this.dateService.format(dateObj, JALALI_DATE_FORMATS.parse.dateInput);
      }
    }
    
    if (value instanceof Date && this.dateService.isValid(value)) {
      return this.dateService.format(value, JALALI_DATE_FORMATS.parse.dateInput);
    }
    
    return null;
  }

  format(date: string, displayFormat: string): string {
    const dateObj = this.dateService.parse(date, JALALI_DATE_FORMATS.parse.dateInput);
    if (!dateObj) return '';
    return this.dateService.format(dateObj, displayFormat);
  }

  addCalendarYears(date: string, years: number): string {
    const pYear = this.getYear(date);
    const pMonth = this.getMonth(date);
    const pDay = this.getDate(date);
    return this.createDate(pYear + years, pMonth, pDay);
  }

  addCalendarMonths(date: string, months: number): string {
    const pYear = this.getYear(date);
    const pMonth = this.getMonth(date);
    const pDay = this.getDate(date);

    const totalMonths = pMonth + months;
    const newYear = pYear + Math.floor(totalMonths / 12);
    let newMonth = totalMonths % 12;
    
    // Handle negative months
    if (newMonth < 0) {
      newMonth = 12 + newMonth;
    }

    // Handle month overflow by adjusting day if needed
    const maxDay = this._getMaxDayInMonth(newYear, newMonth);
    const adjustedDay = Math.min(pDay, maxDay);

    return this.createDate(newYear, newMonth, adjustedDay);
  }

  addCalendarDays(date: string, days: number): string {
    const dateObject = this.dateService.parse(date, JALALI_DATE_FORMATS.parse.dateInput);
    if (!dateObject) return date;
    
    dateObject.setDate(dateObject.getDate() + days);
    return this.dateService.format(dateObject, JALALI_DATE_FORMATS.parse.dateInput);
  }

  toIso8601(date: string): string {
    const dateObject = this.dateService.parse(date, JALALI_DATE_FORMATS.parse.dateInput);
    if (!dateObject) return '';
    return dateObject.toISOString();
  }

  isDateInstance(obj: any): boolean {
    return typeof obj === 'string' && /^\d{4}\/\d{1,2}\/\d{1,2}$/.test(obj);
  }

  isValid(date: string | null): boolean {
    if (!date) return false;
    const dateObj = this.dateService.parse(date, JALALI_DATE_FORMATS.parse.dateInput);
    return dateObj !== null && this.dateService.isValid(dateObj);
  }

  override deserialize(value: any): string | null {
    if (!value) return null;

    if (typeof value === 'string') {
      return this.parse(value, JALALI_DATE_FORMATS.parse.dateInput);
    }

    if (typeof value === 'number') {
      return this.dateService.format(new Date(value), JALALI_DATE_FORMATS.parse.dateInput);
    }

    if (value instanceof Date) {
      return this.dateService.format(value, JALALI_DATE_FORMATS.parse.dateInput);
    }

    return null;
  }

  private _getMaxDayInMonth(year: number, month: number): number {
    // Persian calendar: first 6 months (0-5) have 31 days, next 5 months (6-10) have 30, last month (11) has 29/30
    if (month < 6) return 31;   // Farvardin to Shahrivar (months 0-5)
    if (month < 11) return 30;  // Mehr to Bahman (months 6-10)
    
    // Esfand (month 11) - check if it's a leap year
    return this.dateService.isLeapYear(year) ? 30 : 29;
  }
}