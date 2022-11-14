import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRequestAppointmentComponent } from './patient-request-appointment.component';

describe('PatientRequestAppointmentComponent', () => {
  let component: PatientRequestAppointmentComponent;
  let fixture: ComponentFixture<PatientRequestAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientRequestAppointmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientRequestAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
