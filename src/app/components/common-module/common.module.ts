import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonModules } from './common-routing.module';
import { CommonModuleComponent } from './common.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule } from '@angular/forms';
import { ServiceHoursPipe } from 'src/app/pipes/service-hours.pipe';
import { SpecialtiesPipe } from 'src/app/pipes/specialties.pipe';


@NgModule({
  declarations: [
    CommonModuleComponent, 
    NavbarComponent,
    ProfileComponent,
    ServiceHoursPipe,
    SpecialtiesPipe
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
  ]
})
export class SharedModule { }
