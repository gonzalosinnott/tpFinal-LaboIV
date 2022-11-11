import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { Auth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../services/spinner.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class PatientGuard implements CanActivate {

  constructor(private readonly firestore: FirestoreService,
              private readonly Auth: Auth,
              public afAuth: AngularFireAuth,
              private readonly router: Router,
              private spinnerService: SpinnerService,
              private toastr: ToastrService) {
    this.spinnerService.show();   
  }

  canActivate(): any {

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.firestore.getUserRole(this.Auth.currentUser.uid).then
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
          return false;
        });
        return true;  
        } else {
        this.router.navigate(['/login']);
        this.spinnerService.hide();
        return false; 
      }
    }); 
  }  
}
