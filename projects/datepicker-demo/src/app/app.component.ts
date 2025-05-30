import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,

  Validators,
} from '@angular/forms';
import { NormalDatepickerDemoComponent } from './normal-datepicker-demo/normal-datepicker-demo.component';
import { StringDatepickerDemoComponent } from './string-datepicker-demo/string-datepicker-demo.component';
import { JalaliDateService } from 'AngularMaterialJalaliDatepickerAdapter';

@Component({
  selector: 'app-root',
  imports: [
    NormalDatepickerDemoComponent,
    StringDatepickerDemoComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    // { provide: DateAdapter, useClass: MaterialPersianDateAdapter },
    // { provide: MAT_DATE_LOCALE, useValue: 'fa-IR' },
    // { provide: MAT_DATE_FORMATS, useValue: PERSIAN_DATE_FORMATS },
  ],
})
export class AppComponent {
  title = 'datepicker-demo';
  formGroup = new FormGroup({
    basic: new FormControl(null, Validators.required),
  });
  constructor() {
    const service = inject(JalaliDateService)
  }
}
