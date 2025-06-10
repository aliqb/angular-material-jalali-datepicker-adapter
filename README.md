# Angular Material Jalali Date Adapter

A comprehensive Angular library that provides Jalali (Persian/Solar Hijri/ Shamsi/ ) date adapter fro angular material datepicker component. Angular material datepicker does not support Jalali date natively but you can write adapter for custom date formats and systems, this library include adapters for adopting Jalali date systems with date object and string and zero dependency like moment and etc.


## Motivation
Working with date in JS have been being hard for ages, Working with other date systems like jalali is even harder. There are bunch of JS libraries utilizing date operations and most of them like moment and date-fns has related dateAdapter in material library but they can not be used easily with jalali system. Also since introduction of Intl api basic date operation can be done with vanilla JS easier and also there are not many formats for jalali system (It can be said always yyyy/MM/dd is used) so you may not want to include a heavy library in your project anymore.

This library provide two adapter for material for adopting jalai system. One assume native date object as input and another accept string in standard jalai format (yyyy/MM/dd)


## Features

- 🗓️ Work with both Date object and string input
- 📅 Compatible with `mat-datepicker`, `mat-date-range-picker`, and related components
- ⚡ Zero dependency 
- ⚡ Lightweight and performant
- 🔧 Easy integration with existing Angular Material projects

## Installation

```bash
npm install npm i angular-material-jalali-datepicker-adapter
```

Or using yarn:

```bash
yarn add angular-material-jalali-datepicker-adapter
```

## Demo
[stackblitz demo](https://stackblitz.com/edit/stackblitz-starters-3hhtwcfu?file=src%2Fmain.ts)

## Peer Dependencies

This is developed and tested on angular and angular material 19 but it supposed to work with all previous and later supported version because there has not been any breaking change in material datepicker since introduction.

## Usage

### Basic Setup

1. Import the module in your Angular application:

```typescript
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideJalaiDateAdapter } from 'AngularMaterialJalaliDatepickerAdapter';

@Component({
  selector: 'app-normal-datepicker-demo',
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './normal-datepicker-demo.component.html',
  styleUrl: './normal-datepicker-demo.component.scss',
  providers: [
      provideJalaiDateAdapter()

  ],
})
export class MyComponent {
    ////
}
```
provideJalaiDateAdapter accept an argument with type 'date' | 'string' (default is 'date'), if you pass string datepicker will work with string date input in format 'yyyy/MM/dd' otherwise native Date object is needed.

You can also pass providers separately

```typescript

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { JALALI_DATE_FORMATS, MaterialJalaliDateAdapter, MaterialJalaliStringDateAdapter } from 'AngularMaterialJalaliDatepickerAdapter';

@Component({
  selector: 'app-normal-datepicker-demo',
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './normal-datepicker-demo.component.html',
  styleUrl: './normal-datepicker-demo.component.scss',
  providers: [
    {
      provide: DateAdapter,
      useClass: MaterialJalaliDateAdapter,//or MaterialJalaliStringDateAdapter
    },
    { provide: MAT_DATE_LOCALE, useValue: 'fa-IR' },
    { provide: MAT_DATE_FORMATS, useValue: JALALI_DATE_FORMATS },

  ],
})
export class MyComponent {
    ////
}
```
For more information about Angular Material datepicker, visit the [official documentation](https://material.angular.dev/components/datepicker/overview).

2. Use with Angular Material date picker:

```html
<mat-form-field>
  <mat-label>تاریخ تولد</mat-label>
  <input matInput [matDatepicker]="picker" [(ngModel)]="selectedDate">
  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
  <mat-datepicker #picker></mat-datepicker>
</mat-form-field>
```

## API Reference

### provideJalaiDateAdapter

provideJalaiDateAdapter accept an argument with type 'date' | 'string' (default is 'date'), if you pass string datepicker will work with string date input in format 'yyyy/MM/dd' otherwise native Date object is needed.

Its returns all there needed providers to customize datepicker

### MaterialJalaliDateAdapter

material dateAdapter witch adopts jalali system and works with native date object.

### MaterialJalaliStringDateAdapter

material dateAdapter witch adopts jalali system and works with standard string format (yyyy/MM/dd).

### JalaliDateService

Both adapters use JalaliDateService for date operations. You can use this service for basic operations directly.

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| **Core Conversion** |
| `toJalali` | `date: Date` | `JalaliDate` | Converts Gregorian date to Jalali calendar |
| `toGregorian` | `year: number, month: number, date: number` | `{year, month, date}` | Converts Jalali components to Gregorian |
| **Date Components** |
| `getYear` | `date: Date` | `number` | Extracts Jalali year from Date object |
| `getMonth` | `date: Date` | `number` | Extracts Jalali month (0-based) from Date |
| `getDate` | `date: Date` | `number` | Extracts Jalali day of month from Date |
| **Formatting & Parsing** |
| `format` | `date: Date, displayFormat: string` | `string` | Formats date with custom pattern |
| `parse` | `value: any, parseFormat?: string` | `Date \| null` | Parses various inputs to Date object |
| **Date Arithmetic** |
| `addDays` | `date: Date, days: number` | `Date` | Adds/subtracts days from date |
| `addMonths` | `date: Date, months: number` | `Date` | Adds/subtracts months with Jalali logic |
| `addYears` | `date: Date, years: number` | `Date` | Adds/subtracts years |
| **Utility Methods** |
| `isValid` | `date: Date \| null` | `boolean` | Validates Date object |
| `isLeapYear` | `year: number` | `boolean` | Checks if Jalali year is leap year |
| `getDaysInMonth` | `year: number, month: number` | `number` | Returns days count in Jalali month |
| **Properties** |
| `monthNames` | - | `string[]` | Persian month names array |
| `dayNames` | - | `object` | Persian day names (long/short/narrow) |

####  Format Tokens

| Token | Description | Example |
|-------|-------------|---------|
| `yyyy` | 4-digit year | 1403 |
| `MM` | 2-digit month | 03 |
| `M` | Month (no leading zero) | 3 |
| `dd` | 2-digit day | 10 |
| `d` | Day (no leading zero) | 10 |
| `MMMM` | Full month name | خرداد |
| `MMM` | Abbreviated month | خرد |



## Contributing

We welcome contributions!

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/aliqb/angular-material-jalali-datepicker-adapter
```

2. Install dependencies:
```bash
npm install
```



3. lib source code is in projects/angular-material-jalali-datepicker-adapter



## Acknowledgments

- Conversions between Jalali and Gregorian has been done by adopting codes of [jalali-ts](https://www.npmjs.com/package/jalali-ts)

---

Made with ❤️ for the Persian developer community


## License

This project is licensed under the MIT License - see the [LICENSE](./projects/angular-material-jalali-datepicker-adapter/LICENSE) file for details.