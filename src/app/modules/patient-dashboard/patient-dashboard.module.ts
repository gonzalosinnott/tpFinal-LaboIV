import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientDashboardRoutingModule } from './patient-dashboard-routing.module';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { PatientHomeComponent } from './patient-home/patient-home.component';
import { SharedModule } from 'src/app/components/common-module/common.module';

@NgModule({
  declarations: [
    PatientDashboardComponent,
    PatientHomeComponent   
  ],
  imports: [
    CommonModule,
    PatientDashboardRoutingModule,
    SharedModule
  ]
})
export class PatientDashboardModule { }
