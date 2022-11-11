import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VerificationComponent } from './components/verification/verification.component';
import { UnloggedGuard } from './guards/unlogged.guard';
import { LoggedGuard } from './guards/logged.guard';
import { AdminGuard } from './guards/admin.guard';
import { PatientGuard } from './guards/patient.guard';
import { DoctorGuard } from './guards/doctor.guard';

const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./modules/login/login.module')
    .then(m => m.LoginModule),
    canActivate: [LoggedGuard]
  },
  { 
    path: 'login', 
    loadChildren: () => import('./modules/login/login.module')
    .then(m => m.LoginModule),
    canActivate: [LoggedGuard]
  },
  { 
    path: 'register', 
    loadChildren: () => import('./modules/register/register.module')
    .then(m => m.RegisterModule),
    canActivate: [LoggedGuard]
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./modules/admin-dashboard/admin-dashboard.module')
    .then(m => m.AdminDashboardModule),
    canActivate: [UnloggedGuard, AdminGuard]
  },
  { 
    path: 'doctor', 
    loadChildren: () => import('./modules/doctor-dashboard/doctor-dashboard.module')
    .then(m => m.DoctorDashboardModule),
    canActivate: [UnloggedGuard, DoctorGuard]
  },
  { 
    path: 'patient', 
    loadChildren: () => import('./modules/patient-dashboard/patient-dashboard.module')
    .then(m => m.PatientDashboardModule),
    canActivate: [UnloggedGuard, PatientGuard]
  },
  {
    path: 'verification',
    component: VerificationComponent,
    canActivate: [UnloggedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
