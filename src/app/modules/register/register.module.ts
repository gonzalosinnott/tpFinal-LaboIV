import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { RegisterHomeComponent } from './register-home/register-home.component';
import { RegisterDoctorComponent } from './register-doctor/register-doctor.component';
import { RegisterPatientComponent } from './register-patient/register-patient.component';
import { SharedModule } from 'src/app/components/common-module/common.module';

@NgModule({
  declarations: [
    RegisterComponent,
    RegisterHomeComponent,
    RegisterDoctorComponent,
    RegisterPatientComponent
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RegisterModule { }
