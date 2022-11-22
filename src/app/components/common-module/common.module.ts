import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonModules } from './common-routing.module';
import { CommonModuleComponent } from './common.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule } from '@angular/forms';
import { ServiceHoursPipe } from 'src/app/pipes/serviceHours.pipe';
import { SpecialtiesPipe } from 'src/app/pipes/specialties.pipe';
import { RequestAppointmentComponent } from './request-appointment/request-appointment.component';
import { UserTypePipe } from 'src/app/pipes/userType.pipe';
import { RequestAppointmentSpecialtyComponent } from './request-appointment-specialty/request-appointment-specialty.component';
import { RequestAppointmentDoctorComponent } from './request-appointment-doctor/request-appointment-doctor.component';
import { RequestAppointmentDateComponent } from './request-appointment-date/request-appointment-date.component';
import { RequestAppointmentPatientComponent } from './request-appointment-patient/request-appointment-patient.component';
import { AppointmentStatusPipe } from 'src/app/pipes/appointmentStatus.pipe';
import { CaptchaComponent } from './captcha/captcha.component';
import { UserNamePipe } from 'src/app/pipes/userrName.pipe';
import { UserTypeStyleDirective } from 'src/app/directives/user-type-style.directive';
import { MouseOverDirective } from 'src/app/directives/mouseover.directive';
import { CaptchaDirective } from 'src/app/directives/captcha.directive';
import { ChartistModule } from "ng-chartist";



@NgModule({
  declarations: [
    CommonModuleComponent, 
    NavbarComponent,
    ProfileComponent,
    RequestAppointmentComponent,
    ServiceHoursPipe,
    SpecialtiesPipe,
    UserTypePipe,
    UserNamePipe,
    AppointmentStatusPipe,
    UserTypeStyleDirective,  
    MouseOverDirective, 
    CaptchaDirective, 
    RequestAppointmentSpecialtyComponent,
    RequestAppointmentDoctorComponent,
    RequestAppointmentDateComponent,
    RequestAppointmentPatientComponent,
    CaptchaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CommonModules,
    ChartistModule
  ],
  exports: [
    CommonModuleComponent,
    NavbarComponent,
    ProfileComponent,
    RequestAppointmentComponent,
    CaptchaComponent,
    SpecialtiesPipe,
    AppointmentStatusPipe,
    UserNamePipe,
    UserTypePipe,
    UserTypeStyleDirective, 
    MouseOverDirective,
    CaptchaDirective,
    ChartistModule   
  ],
  providers: [
    SpecialtiesPipe
  ]
})
export class SharedModule { }
