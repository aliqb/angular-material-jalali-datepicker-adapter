import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MaterialPersianDateAdapter, PERSIAN_DATE_FORMATS } from 'AngularMaterialJalaliDatepickerAdapter';

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
      useClass: MaterialPersianDateAdapter,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'fa-IR' },
    { provide: MAT_DATE_FORMATS, useValue: PERSIAN_DATE_FORMATS },
  ],
})
export class NormalDatepickerDemoComponent {
  formGroup = new FormGroup({
    basic: new FormControl(null, Validators.required),
  });
}
