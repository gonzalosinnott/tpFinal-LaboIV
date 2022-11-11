import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientDashboardRoutingModule } from './patient-dashboard-routing.module';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PatientHomeComponent } from './patient-home/patient-home.component';

@NgModule({
  declarations: [
    PatientDashboardComponent,
    NavbarComponent,
    PatientHomeComponent
  ],
  imports: [
    CommonModule,
    PatientDashboardRoutingModule
  ]
})
export class PatientDashboardModule { }
