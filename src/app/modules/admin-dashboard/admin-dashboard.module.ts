import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { SharedModule } from 'src/app/components/common-module/common.module';
import { AdminRegisterComponent } from './admin-register/admin-register.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminHomeComponent,
    AdminRegisterComponent,
  ],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    SharedModule
  ]
})
export class AdminDashboardModule { }
