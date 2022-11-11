import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { SharedModule } from 'src/app/components/common-module/common.module';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminHomeComponent,
  ],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule, 
    SharedModule
  ]
})
export class AdminDashboardModule { }
