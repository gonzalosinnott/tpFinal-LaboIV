import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { Auth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../services/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class PatientGuard implements CanActivate {

  constructor(private readonly firestore: FirestoreService,
              private readonly router: Router,
              private spinnerService: SpinnerService,
              private toastr: ToastrService) {
    this.spinnerService.show();   
  }

  canActivate(): any {
    var user = JSON.parse(localStorage.getItem('userData'));
    this.firestore.getUserRole(user[0].uid).then
    (role => {
      console.log(role);
      if (role == 'Patient') {
        this.router.navigate(['/patient']);
        this.spinnerService.hide();   
        return true;
      }
      
      if( role == 'Admin') {
        this.router.navigate(['/admin']);
        this.spinnerService.hide();
        this.toastr.error("Acceso denegado. No tiene permisos para acceder a esta página.");
        return false;
      }
      
      if( role == 'Doctor') {
        this.router.navigate(['/doctor']);
        this.spinnerService.hide();
        this.toastr.error("Acceso denegado. No tiene permisos para acceder a esta página.");
        return false;
 
      }

      this.spinnerService.hide();
      this.toastr.error("Acceso denegado. No tiene permisos para acceder a esta página.");  
      return false;
    });
  }
  
}
