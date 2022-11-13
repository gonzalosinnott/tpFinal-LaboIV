import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonModules } from './common-routing.module';
import { CommonModuleComponent } from './common.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    CommonModuleComponent, 
    NavbarComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    CommonModules    
  ],
  exports: [
    CommonModuleComponent,
    NavbarComponent,
    ProfileComponent, 
  ]
})
export class SharedModule { }
