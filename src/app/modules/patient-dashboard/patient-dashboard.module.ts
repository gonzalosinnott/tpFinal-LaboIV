import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientDashboardRoutingModule } from './patient-dashboard-routing.module';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { PatientHomeComponent } from './patient-home/patient-home.component';
import { SharedModule } from 'src/app/components/common-module/common.module';
import { PatientRequestAppointmentComponent } from './patient-request-appointment/patient-request-appointment.component';

@NgModule({
  declarations: [
    PatientDashboardComponent,
    PatientHomeComponent,
    PatientRequestAppointmentComponent   
  ],
  imports: [
    CommonModule,
    PatientDashboardRoutingModule,
    SharedModule
  ]
})
export class PatientDashboardModule { }
