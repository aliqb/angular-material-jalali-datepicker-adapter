import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AngularMaterialJalaliDatepickerAdapterService } from 'AngularMaterialJalaliDatepickerAdapter';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'datepicker-demo';
  testService = inject(
    AngularMaterialJalaliDatepickerAdapterService)

  constructor() {
    this.testService.test();
  }
}
