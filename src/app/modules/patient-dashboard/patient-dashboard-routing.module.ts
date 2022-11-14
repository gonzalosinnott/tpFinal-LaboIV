import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { PatientHomeComponent } from './patient-home/patient-home.component';
import { PatientRequestAppointmentComponent } from './patient-request-appointment/patient-request-appointment.component';

const routes: Routes = [
  { path: '', component: PatientDashboardComponent,children:[
    {path:'',component:PatientHomeComponent},
    {path:'request-appointment',component:PatientRequestAppointmentComponent}
  ]},
  { path: '**', pathMatch: 'full', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientDashboardRoutingModule { }
