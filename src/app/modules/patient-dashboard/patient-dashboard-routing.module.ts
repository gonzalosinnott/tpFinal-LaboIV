import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { PatientHomeComponent } from './patient-home/patient-home.component';

const routes: Routes = [
  { path: '', component: PatientDashboardComponent,children:[
    {path:'',component:PatientHomeComponent}
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientDashboardRoutingModule { }
