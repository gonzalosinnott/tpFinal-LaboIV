import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorDashboardRoutingModule } from './doctor-dashboard-routing.module';
import { DoctorDashboardComponent } from './doctor-dashboard.component';
import { DoctorHomeComponent } from './doctor-home/doctor-home.component';
import { SharedModule } from 'src/app/components/common-module/common.module';

@NgModule({
  declarations: [
    DoctorDashboardComponent,
    DoctorHomeComponent,
  ],
  imports: [
    CommonModule,
    DoctorDashboardRoutingModule,
    SharedModule
  ]
})
export class DoctorDashboardModule { }
