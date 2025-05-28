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
import { provideJalaiDateAdapter } from '../../../../angular-material-jalali-datepicker-adapter/src/public-api';

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
export class NormalDatepickerDemoComponent {
  formGroup = new FormGroup({
    basic: new FormControl(null, Validators.required),
  });
}
