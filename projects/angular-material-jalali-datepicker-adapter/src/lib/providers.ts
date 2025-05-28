import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MaterialJalaliDateAdapter } from './material.jalali-date.adapter';
import { MaterialJalaliStringDateAdapter } from './material.jalali-string-date.adapter';
import { JALALI_DATE_FORMATS } from './date-format';

export function provideJalaiDateAdapter(type: 'date' | 'string' = 'date') {
  return [
    {
      provide: DateAdapter,
      useClass:
        type === 'date'
          ? MaterialJalaliDateAdapter
          : MaterialJalaliStringDateAdapter,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'fa-IR' },
    { provide: MAT_DATE_FORMATS, useValue: JALALI_DATE_FORMATS },
  ];
}
