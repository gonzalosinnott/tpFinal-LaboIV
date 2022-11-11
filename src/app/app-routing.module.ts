import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VerificationComponent } from './components/verification/verification.component';

import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { AdminGuard } from './guards/admin.guard';
import { PatientGuard } from './guards/patient.guard';
import { DoctorGuard } from './guards/doctor.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['admin']);

const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./modules/login/login.module')
    .then(m => m.LoginModule),
    ...canActivate(redirectLoggedInToHome),
  },
  { 
    path: 'login', 
    loadChildren: () => import('./modules/login/login.module')
    .then(m => m.LoginModule),
    ...canActivate(redirectLoggedInToHome),
  },
  { 
    path: 'register', 
    loadChildren: () => import('./modules/register/register.module')
    .then(m => m.RegisterModule),
    ...canActivate(redirectLoggedInToHome),
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./modules/admin-dashboard/admin-dashboard.module')
    .then(m => m.AdminDashboardModule),
    ...canActivate(redirectUnauthorizedToLogin),
    canActivate: [AdminGuard]
  },
  { 
    path: 'doctor', 
    loadChildren: () => import('./modules/doctor-dashboard/doctor-dashboard.module')
    .then(m => m.DoctorDashboardModule),
    ...canActivate(redirectUnauthorizedToLogin),
    canActivate: [DoctorGuard]
  },
  { 
    path: 'patient', 
    loadChildren: () => import('./modules/patient-dashboard/patient-dashboard.module')
    .then(m => m.PatientDashboardModule),
    ...canActivate(redirectUnauthorizedToLogin),
    canActivate: [PatientGuard]
  },
  {
    path: 'verification',
    component: VerificationComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  { path: '**', pathMatch: 'full', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
