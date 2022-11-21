import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { DoctorDashboardComponent } from './doctor-dashboard.component';
import { DoctorHomeComponent } from './doctor-home/doctor-home.component';
import { PatientsComponent } from './patients/patients.component';

const routes: Routes = [
  { path: '', component: DoctorDashboardComponent,children:[
    {path:'',component:DoctorHomeComponent},
    {path:'patients',component:PatientsComponent}
  ]},
  { path: '**', pathMatch: 'full', component: NotFoundComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorDashboardRoutingModule { }
