import { TestBed } from '@angular/core/testing';

import { JalaliDateService } from './jalali-date.service';

describe('AngularMaterialJalaliDatepickerAdapterService', () => {
  let service: JalaliDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JalaliDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
