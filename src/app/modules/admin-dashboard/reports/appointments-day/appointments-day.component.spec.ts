import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsDayComponent } from './appointments-day.component';

describe('AppointmentsDayComponent', () => {
  let component: AppointmentsDayComponent;
  let fixture: ComponentFixture<AppointmentsDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentsDayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentsDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
