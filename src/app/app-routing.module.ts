import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./modules/login/login.module')
    .then(m => m.LoginModule)      
  },
  { 
    path: 'login', 
    loadChildren: () => import('./modules/login/login.module')
    .then(m => m.LoginModule)  
  },
  { 
    path: 'register', 
    loadChildren: () => import('./modules/register/register.module')
    .then(m => m.RegisterModule)  
  },
  { 
    path: 'admin-dashboard', 
    loadChildren: () => import('./modules/admin-dashboard/admin-dashboard.module')
    .then(m => m.AdminDashboardModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'doctor-dashboard', 
    loadChildren: () => import('./modules/doctor-dashboard/doctor-dashboard.module')
    .then(m => m.DoctorDashboardModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'patient-dashboard', 
    loadChildren: () => import('./modules/patient-dashboard/patient-dashboard.module')
    .then(m => m.PatientDashboardModule),
    canActivate: [AuthGuard]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
