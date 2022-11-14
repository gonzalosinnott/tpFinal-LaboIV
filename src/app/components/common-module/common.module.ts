import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonModules } from './common-routing.module';
import { CommonModuleComponent } from './common.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule } from '@angular/forms';
import { ServiceHoursPipe } from 'src/app/pipes/service-hours.pipe';
import { SpecialtiesPipe } from 'src/app/pipes/specialties.pipe';
import { RequestAppointmentComponent } from './request-appointment/request-appointment.component';
import { UserTypePipe } from 'src/app/pipes/user-type.pipe';
import { RequestAppointmentSpecialtyComponent } from './request-appointment-specialty/request-appointment-specialty.component';
import { RequestAppointmentDoctorComponent } from './request-appointment-doctor/request-appointment-doctor.component';
import { RequestAppointmentDateComponent } from './request-appointment-date/request-appointment-date.component';
import { RequestAppointmentPatientComponent } from './request-appointment-patient/request-appointment-patient.component';


@NgModule({
  declarations: [
    CommonModuleComponent, 
    NavbarComponent,
    ProfileComponent,
    RequestAppointmentComponent,
    ServiceHoursPipe,
    SpecialtiesPipe,
    UserTypePipe,
    RequestAppointmentSpecialtyComponent,
    RequestAppointmentDoctorComponent,
    RequestAppointmentDateComponent,
    RequestAppointmentPatientComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CommonModules,
  ],
  exports: [
    CommonModuleComponent,
    NavbarComponent,
    ProfileComponent,
    RequestAppointmentComponent,
    SpecialtiesPipe,
  ]
})
export class SharedModule { }
