import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalDatepickerDemoComponent } from './normal-datepicker-demo.component';

describe('NormalDatepickerDemoComponent', () => {
  let component: NormalDatepickerDemoComponent;
  let fixture: ComponentFixture<NormalDatepickerDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NormalDatepickerDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NormalDatepickerDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
