import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {  MaterialJalaliStringDateAdapter, JALALI_DATE_FORMATS } from 'AngularMaterialJalaliDatepickerAdapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-string-datepicker-demo',
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './string-datepicker-demo.component.html',
  styleUrl: './string-datepicker-demo.component.scss',
    providers: [
    {
      provide: DateAdapter,
      useClass: MaterialJalaliStringDateAdapter,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'fa-IR' },
    { provide: MAT_DATE_FORMATS, useValue: JALALI_DATE_FORMATS },
  ],
})
export class StringDatepickerDemoComponent {
  formGroup = new FormGroup({
    basic: new FormControl(null, Validators.required),
  });
}
