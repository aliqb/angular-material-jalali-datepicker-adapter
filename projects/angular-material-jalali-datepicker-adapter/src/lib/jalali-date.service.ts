import { Injectable } from '@angular/core';

interface JalaliDate {
  year: number;
  month: number;
  day: number;
}

@Injectable({
  providedIn: 'root',
})
export class JalaliDateService {
  private readonly _locale = 'fa-IR';
  private readonly _calendar = 'persian';

  private readonly _monthNames = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ];

  private readonly _dayNames = {
    long: [
      'شنبه',
      'یکشنبه',
      'دوشنبه',
      'سه‌شنبه',
      'چهارشنبه',
      'پنج‌شنبه',
      'جمعه',
    ],
    short: ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'],
    narrow: ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'],
  };

  private readonly breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
    2192, 2262, 2324, 2394, 2456, 3178,
  ];

  // Cache formatter to avoid recreating
  private _formatter?: Intl.DateTimeFormat;

  get monthNames(): string[] {
    return [...this._monthNames];
  }

  get dayNames() {
    return this._dayNames;
  }

  private getFormatter(): Intl.DateTimeFormat {
    return (this._formatter ||= new Intl.DateTimeFormat(this._locale, {
      calendar: this._calendar,
      numberingSystem: 'latn',
    }));
  }

  getYear(date: Date): number {
    return parseInt(
      this.getFormatter()
        .formatToParts(date)
        .find((part) => part.type === 'year')?.value || '0'
    );
  }

  getMonth(date: Date): number {
    return (
      parseInt(
        this.getFormatter()
          .formatToParts(date)
          .find((part) => part.type === 'month')?.value || '1'
      ) - 1
    );
  }

  getDate(date: Date): number {
    return parseInt(
      this.getFormatter()
        .formatToParts(date)
        .find((part) => part.type === 'day')?.value || '1'
    );
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  addMonths(date: Date, months: number): Date {
    const jalali = this.toJalali(date);
    let newMonth = jalali.month + months;
    let newYear = jalali.year;

    while (newMonth > 12) {
      newMonth -= 12;
      newYear++;
    }
    while (newMonth < 1) {
      newMonth += 12;
      newYear--;
    }

    // Handle day overflow for different month lengths
    const maxDaysInMonth = this.getDaysInMonth(newYear, newMonth);
    const newDay = Math.min(jalali.day, maxDaysInMonth);

    const gregorian = this.toGregorian(newYear, newMonth, newDay);
    return new Date(gregorian.year, gregorian.month - 1, gregorian.date);
  }

  addYears(date: Date, years: number): Date {
    return this.addMonths(date, years * 12);
  }

  parse(value: any, parseFormat: string = 'yyyy/MM/dd'): Date | null {
    if (!value || value === '') return null;

    if (value instanceof Date) {
      return this.isValid(value) ? value : null;
    }

    if (typeof value === 'string') {
      return this.parseString(value.trim(), parseFormat);
    }

    if (typeof value === 'number') {
      const date = new Date(value);
      return this.isValid(date) ? date : null;
    }

    return null;
  }

  private parseString(dateStr: string, format: string): Date | null {
    // Convert Persian digits
    const normalizedStr = dateStr.replace(/[۰-۹]/g, (d) =>
      '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()
    );

    // Simple yyyy/MM/dd parsing (most common case)
    if (format === 'yyyy/MM/dd') {
      const match = normalizedStr.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
      if (match) {
        const [, year, month, day] = match.map(Number);
        return this.createJalaliDate(year, month, day);
      }
    }

    return null;
  }

  private createJalaliDate(
    year: number,
    month: number,
    day: number
  ): Date | null {
    try {
      const gregorian = this.toGregorian(year, month, day);
      const date = new Date(
        gregorian.year,
        gregorian.month - 1,
        gregorian.date
      );
      return this.isValid(date) ? date : null;
    } catch {
      return null;
    }
  }

  format(date: Date, displayFormat: string): string {
    if (!this.isValid(date)) return '';

    const year = this.getYear(date);
    const month = this.getMonth(date) + 1;
    const day = this.getDate(date);

    // Handle common format patterns
    return displayFormat
      .replace(/yyyy/g, year.toString())
      .replace(/MM/g, month.toString().padStart(2, '0'))
      .replace(/dd/g, day.toString().padStart(2, '0'))
      .replace(/M/g, month.toString())
      .replace(/d/g, day.toString());
  }

  isValid(date: Date | null): boolean {
    return date !== null && date instanceof Date && !isNaN(date.getTime());
  }

  getDaysInMonth(year: number, month: number): number {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    return this.isLeapYear(year) ? 30 : 29;
  }

  // Convert Gregorian to Jalali
  toJalali(date: Date): JalaliDate {
    const year = this.getYear(date);
    const month = this.getMonth(date) + 1; // Convert to 1-based
    const day = this.getDate(date);
    return { year, month, day };
  }

  toGregorian(
    year: number,
    month: number,
    date: number
  ): { year: number; month: number; date: number } {
    const julian = this.jalaliToJulian(year, month, date);
    return this.julianToGregorian(julian);
  }

  isLeapYear(year: number): boolean {
    try {
      const leap = this.calculateLeap(year);
      return leap === 0;
    } catch {
      return false;
    }
  }

  // Core conversion methods (simplified)
  private jalaliToJulian(year: number, month: number, date: number): number {
    const r = this.calculateJalali(year, false);

    return (
      this.gregorianToJulian(r.gregorianYear, 3, r.march) +
      (month - 1) * 31 -
      this.div(month, 7) * (month - 7) +
      date -
      1
    );
  }

  private julianToGregorian(julian: number): {
    year: number;
    month: number;
    date: number;
  } {
    let j: number = 4 * julian + 139361631;
    j =
      j + this.div(this.div(4 * julian + 183187720, 146097) * 3, 4) * 4 - 3908;

    const i: number = this.div(this.mod(j, 1461), 4) * 5 + 308;

    const date: number = this.div(this.mod(i, 153), 5) + 1;
    const month: number = this.mod(this.div(i, 153), 12) + 1;
    const year: number = this.div(j, 1461) - 100100 + this.div(8 - month, 6);

    return { year, month, date };
  }

  private gregorianToJulian(year: number, month: number, date: number): number {
    const julian: number =
      this.div((year + this.div(month - 8, 6) + 100100) * 1461, 4) +
      this.div(153 * this.mod(month + 9, 12) + 2, 5) +
      date -
      34840408;

    return (
      julian -
      this.div(this.div(year + 100100 + this.div(month - 8, 6), 100) * 3, 4) +
      752
    );
  }

  private calculateJalali(
    year: number,
    calculateLeap: boolean = true
  ): {
    gregorianYear: number;
    march: number;
    leap: number;
  } {
    const bl: number = this.breaks.length;
    const gregorianYear: number = year + 621;
    let leapJ: number = -14;
    let jp: number = this.breaks[0];

    if (year < jp || year >= this.breaks[bl - 1]) {
      throw new Error(`Invalid Jalali year ${year}`);
    }

    let jump: number = 0;
    for (let i = 1; i < bl; i++) {
      const jm = this.breaks[i];
      jump = jm - jp;
      if (year < jm) break;
      leapJ = leapJ + this.div(jump, 33) * 8 + this.div(this.mod(jump, 33), 4);
      jp = jm;
    }

    let n: number = year - jp;
    leapJ = leapJ + this.div(n, 33) * 8 + this.div(this.mod(n, 33) + 3, 4);
    if (this.mod(jump, 33) === 4 && jump - n === 4) {
      leapJ += 1;
    }

    const leapG: number =
      this.div(gregorianYear, 4) -
      this.div((this.div(gregorianYear, 100) + 1) * 3, 4) -
      150;
    const march: number = 20 + leapJ - leapG;

    return {
      gregorianYear,
      march,
      leap: calculateLeap ? this.calculateLeap(year, { jp, jump }) : -1,
    };
  }

  private calculateLeap(
    year: number,
    calculated?: { jp: number; jump: number }
  ): number {
    const bl: number = this.breaks.length;
    let jp: number = calculated ? calculated.jp : this.breaks[0];
    let jump: number = calculated ? calculated.jump : 0;

    if (!calculated) {
      if (year < jp || year >= this.breaks[bl - 1]) {
        throw new Error(`Invalid Jalali year ${year}`);
      }

      for (let i = 1; i < bl; i++) {
        const jm = this.breaks[i];
        jump = jm - jp;
        if (year < jm) break;
        jp = jm;
      }
    }

    let n: number = year - jp;
    if (jump - n < 6) {
      n = n - jump + this.div(jump + 4, 33) * 33;
    }

    let leap: number = this.mod(this.mod(n + 1, 33) - 1, 4);
    if (leap === -1) {
      leap = 4;
    }

    return leap;
  }
  private div(a: number, b: number): number {
    return ~~(a / b);
  }

  private mod(a: number, b: number): number {
    return a - ~~(a / b) * b;
  }
}
