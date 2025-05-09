import { TestBed } from '@angular/core/testing';

import { AngularMaterialJalaliDatepickerAdapterService } from './angular-material-jalali-datepicker-adapter.service';

describe('AngularMaterialJalaliDatepickerAdapterService', () => {
  let service: AngularMaterialJalaliDatepickerAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularMaterialJalaliDatepickerAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
