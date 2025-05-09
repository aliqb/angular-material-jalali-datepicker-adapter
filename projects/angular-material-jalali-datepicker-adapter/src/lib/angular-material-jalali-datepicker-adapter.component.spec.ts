import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularMaterialJalaliDatepickerAdapterComponent } from './angular-material-jalali-datepicker-adapter.component';

describe('AngularMaterialJalaliDatepickerAdapterComponent', () => {
  let component: AngularMaterialJalaliDatepickerAdapterComponent;
  let fixture: ComponentFixture<AngularMaterialJalaliDatepickerAdapterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularMaterialJalaliDatepickerAdapterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngularMaterialJalaliDatepickerAdapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
