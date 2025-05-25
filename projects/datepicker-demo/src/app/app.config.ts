import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { AngularMaterialJalaliDatepickerAdapterComponent } from 'AngularMaterialJalaliDatepickerAdapter';
import { PERSIAN_DATE_FORMATS } from '../../../angular-material-jalali-datepicker-adapter/src/lib/material.persian-date.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: DateAdapter,
      useClass: AngularMaterialJalaliDatepickerAdapterComponent,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'fa-IR' },
    { provide: MAT_DATE_FORMATS, useValue: PERSIAN_DATE_FORMATS },
  ],
};
