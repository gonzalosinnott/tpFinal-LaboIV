import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminRegisterComponent } from './admin-register/admin-register.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent,children:[
    {path:'',component:AdminHomeComponent},
    {path:'register',component:AdminRegisterComponent}
  ]},
  { path: '**', pathMatch: 'full', component: NotFoundComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { }
