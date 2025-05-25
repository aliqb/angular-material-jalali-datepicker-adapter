import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MaterialPersianDateAdapter,
  PERSIAN_DATE_FORMATS,
} from '../../../angular-material-jalali-datepicker-adapter/src/lib/material.persian-date.adapter';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    { provide: DateAdapter, useClass: MaterialPersianDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'fa-IR' },
    { provide: MAT_DATE_FORMATS, useValue: PERSIAN_DATE_FORMATS },
  ],
})
export class AppComponent {
  title = 'datepicker-demo';
  formGroup = new FormGroup({
    basic: new FormControl(null, Validators.required),
  });
  constructor() {}
}
