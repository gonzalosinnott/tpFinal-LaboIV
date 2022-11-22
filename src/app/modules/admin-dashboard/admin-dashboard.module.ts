import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { SharedModule } from 'src/app/components/common-module/common.module';
import { AdminRegisterComponent } from './admin-register/admin-register.component';
import { AdminRequestAppointmentComponent } from './admin-request-appointment/admin-request-appointment.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { UsersComponent } from './users/users.component';
import { ReportsComponent } from './reports/reports.component';
import { AppointmentsDoctorComponent } from './reports/appointments-doctor/appointments-doctor.component';
import { LogsComponent } from './reports/logs/logs.component';
import { AppointmentsSpecialtyComponent } from './reports/appointments-specialty/appointments-specialty.component';
import { AppointmentsDayComponent } from './reports/appointments-day/appointments-day.component';
import { AppointmentsEndedComponent } from './reports/appointments-ended/appointments-ended.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminHomeComponent,
    AdminRegisterComponent,
    AdminRequestAppointmentComponent,
    AppointmentsComponent,
    UsersComponent,
    ReportsComponent,
    AppointmentsDoctorComponent,
    LogsComponent,
    AppointmentsSpecialtyComponent,
    AppointmentsDayComponent,
    AppointmentsEndedComponent,    
  ],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    SharedModule,
  ]
})
export class AdminDashboardModule { }
