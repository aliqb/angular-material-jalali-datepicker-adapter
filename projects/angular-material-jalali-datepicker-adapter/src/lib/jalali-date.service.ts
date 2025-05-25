import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JalaliDateService {

  private _locale = 'fa-IR';
  private _calendar = 'persian';
  private _monthNames = [
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

  

  get monthNames(): string[] {
    return [...this._monthNames];
  }

  private breaks: number[] = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
    2192, 2262, 2324, 2394, 2456, 3178,
  ];

  constructor() {}

  getYear(date: Date): number {
    return parseInt(
      new Intl.DateTimeFormat(this._locale, {
        calendar: this._calendar,
        year: 'numeric',
        numberingSystem: 'latn',
      }).format(date)
    );
  }

  getMonth(date: Date): number {
    // Intl months are 1-based, but Angular Material expects 0-based
    return (
      parseInt(
        new Intl.DateTimeFormat(this._locale, {
          calendar: this._calendar,
          month: 'numeric',
          numberingSystem: 'latn',
        }).format(date)
      ) - 1
    );
  }

  getDate(date: Date): number {
    return parseInt(
      new Intl.DateTimeFormat(this._locale, {
        calendar: this._calendar,
        day: 'numeric',
        numberingSystem: 'latn',
      }).format(date)
    );
  }



  parse(value: any, parseFormat: string='yyyy/MM/dd'): Date | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    // If it's already a Date object
    if (value instanceof Date && this.isValid(value)) {
      return value;
    }

    // If it's a string
    if (typeof value === 'string') {
      return this.parseWithFormat(value, parseFormat);
    }

    // If it's a timestamp number
    if (typeof value === 'number') {
      const date = new Date(value);
      return this.isValid(date) ? date : null;
    }

    return null;
  }

  private parseWithFormat(dateStr: string, format: string): Date | null {
    // Convert Persian digits to Latin if present
    const convertPersianToLatin = (str: string): string => {
      const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      return str.replace(/[۰-۹]/g, char => String(persianDigits.indexOf(char)));
    };
    
    dateStr = convertPersianToLatin(dateStr);
    
    // Define format tokens
    const tokens: Record<string, RegExp> = {
      'yyyy': /(\d{4})/,
      'yy': /(\d{2})/,
      'MM': /(\d{2})/,
      'M': /(\d{1,2})/,
      'dd': /(\d{2})/,
      'd': /(\d{1,2})/,
      'HH': /(\d{2})/,
      'H': /(\d{1,2})/,
      'mm': /(\d{2})/,
      'm': /(\d{1,2})/,
      'ss': /(\d{2})/,
      's': /(\d{1,2})/,
      'SSS': /(\d{3})/,
      'S': /(\d{1,3})/
    };
    
    // Replace format tokens with regex capturing groups
    let regexPattern = '^' + format
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special regex chars
      .replace(/yyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s|SSS|S/g, match => 
        tokens[match].source
      ) + '$';
    const regex = new RegExp(regexPattern);
    const match = regex.exec(dateStr);
    
    if (!match) {
      return null;
    }
    
    // Extract values from the match
    let year = 0, month = 0, day = 0;
    let hour = 0, minute = 0, second = 0, millisecond = 0;
    
    let matchIndex = 1;
    for (const token of format.match(/yyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s|SSS|S/g) || []) {
      const value = parseInt(match[matchIndex], 10);
      matchIndex++;
      
      switch (token) {
        case 'yyyy':
          year = value;
          break;
        case 'yy':
          year = value < 40 ? 1400 + value : 1300 + value;
          break;
        case 'MM':
        case 'M':
          month = value;
          break;
        case 'dd':
        case 'd':
          day = value;
          break;
        case 'HH':
        case 'H':
          hour = value;
          break;
        case 'mm':
        case 'm':
          minute = value;
          break;
        case 'ss':
        case 's':
          second = value;
          break;
        case 'SSS':
        case 'S':
          millisecond = value;
          break;
      }
    }
    
    if (year && month && day) {
      try {
        const gregorian = this.toGregorian(year, month, day);
        return new Date(
          gregorian.year,
          gregorian.month - 1,
          gregorian.date,
          hour,
          minute,
          second,
          millisecond
        );
      } catch (error) {
        console.error('Error parsing date with format:', error);
      }
    }
    
    return null;
  }

  //week of year can be added
  format(date: Date, displayFormat: string): string {
    if (!this.isValid(date)) {
      return '';
    }

    const getDayWithSuffix = (d: number) => {
      if (d > 3 && d < 21) return `${d}ام`;
      switch (d % 10) {
        case 1:
          return 'اول';
        case 2:
          return 'دوم';
        case 3:
          return 'سوم';
        default:
          return `${d}ام`;
      }
    };

    // Replace the formatting tokens with Intl-based formatting
    const year = this.getYear(date);
    const month = this.getMonth(date) + 1; // Convert to 1-based for display
    const day = this.getDate(date);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    // Get day of week (0 = Sunday, 6 = Saturday)
    const dayOfWeek =  (date.getDay() + 1) % 7; 

    // Create date formatter for locale-aware formatting
    const dateFormatter = new Intl.DateTimeFormat(this._locale, {
      weekday: 'long',
      month: 'long',
      calendar: this._calendar,
      numberingSystem: 'latn',
    });
    const parts = dateFormatter.formatToParts(date);

    // Extract weekday and month names from formatter
    const weekdayLong =
      parts.find((part) => part.type === 'weekday')?.value || '';
    const monthLong = parts.find((part) => part.type === 'month')?.value || '';

    // Short versions (first 3 characters)
    const weekdayShort = weekdayLong.substring(0, 2);
    const weekdayAbbr = weekdayLong.substring(0, 3);
    const weekdayNarrow = weekdayLong.substring(0, 1);
    const monthShort = monthLong.substring(0, 3);

    // Get AM/PM designator
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // 12-hour format hours
    const hours12 = hours % 12 || 12;

    // Quarter of year (1-4)
    const quarter = Math.floor((month - 1) / 3) + 1;

    // Day of year (1-366)
    const gregorian = this.toGregorian(year, 1, 1);
    const gregorianDateOfFirst = new Date(
      gregorian.year,
      gregorian.month - 1,
      gregorian.date
    );
    const dayOfYear = Math.ceil(
      (date.getTime() - gregorianDateOfFirst.getTime()) / (24 * 60 * 60 * 1000)
    );

    let result = displayFormat
      // Year formats
      .replace(/yyyy/gi, year.toString().padStart(4, '0'))
      .replace(/yy/gi, year.toString().substring(2).padStart(2, '0'))

      // Month formats
      .replace(/MMMM/g, monthLong)
      .replace(/MMM/g, monthShort)
      .replace(/MM/g, month.toString().padStart(2, '0'))
      .replace(/M/g, month.toString())

      // Day formats
      // .replace(/dddd/g, weekdayLong)
      // .replace(/ddd/g, weekdayShort)
      .replace(/dd/g, day.toString().padStart(2, '0'))
      .replace(/do/g, getDayWithSuffix(day))
      .replace(/d/g, day.toString())

      // Hour formats (24-hour)
      .replace(/HH/g, hours.toString().padStart(2, '0'))
      .replace(/H/g, hours.toString())

      // Hour formats (12-hour)
      .replace(/hh/g, hours12.toString().padStart(2, '0'))
      .replace(/h/g, hours12.toString())

      // Minute formats
      .replace(/mm/g, minutes.toString().padStart(2, '0'))
      .replace(/m/g, minutes.toString())

      // Second formats
      .replace(/ss/g, seconds.toString().padStart(2, '0'))
      .replace(/s/g, seconds.toString())

      // Millisecond format
      .replace(/SSS/g, milliseconds.toString().padStart(3, '0'))

      // AM/PM formats
      .replace(/a/g, ampm.toLowerCase())
      .replace(/A/g, ampm)

      // Quarter format
      .replace(/Q/g, quarter.toString())

      // Day of year format (1-366)
      .replace(/DDD/g, dayOfYear.toString().padStart(3, '0'))
      .replace(/DD/g, dayOfYear.toString().padStart(2, '0'))
      .replace(/Do/, getDayWithSuffix(dayOfYear))
      .replace(/D/, dayOfYear.toString())

      // Day of week format (0-6)
      .replace(/eeeeee/g, weekdayShort)
      .replace(/eeeee/g, weekdayNarrow)
      .replace(/eeee/g, weekdayLong)
      .replace(/eee/, weekdayAbbr)
      .replace(/ee/, dayOfWeek.toString().padStart(2, '0'))
      .replace(/e/, dayOfWeek.toString())

      // Day of week format (name)
      .replace(/EEEEEE/g, weekdayShort)
      .replace(/EEEEE/g, weekdayNarrow)
      .replace(/EEEE/g, weekdayLong)
      .replace(/[E]+/g,weekdayAbbr)

    return result;
  }

  isValid(date: Date | null): boolean {
    return date !== null && date instanceof Date && !isNaN(date.getTime());
  }

  toGregorian(
    year: number,
    month: number,
    date: number
  ): { year: number; month: number; date: number } {
    const julian: number = this.jalaliToJulian(year, month, date);

    return this.julianToGregorian(julian);
  }

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
