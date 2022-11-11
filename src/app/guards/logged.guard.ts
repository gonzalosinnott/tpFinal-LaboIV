import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivate, Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { ToastrService } from 'ngx-toastr';
import { FirestoreService } from '../services/firestore.service';
import { SpinnerService } from '../services/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {

  constructor(private readonly firestore: FirestoreService,
              private readonly router: Router,
              public afAuth: AngularFireAuth,
              private spinnerService: SpinnerService,
              private toastr: ToastrService) {
    this.spinnerService.show();   
  }

  canActivate(): any {

    if (localStorage.getItem('userData') !== null) {
      var user = JSON.parse(localStorage.getItem('userData'));
      this.firestore.getUserRole(user[0].uid).then
      (role => {
        console.log(role);
        if (role == 'Doctor') {
          this.router.navigate(['/doctor']);
          this.spinnerService.hide();
          this.toastr.error("Sesion ya iniciada.");
          return false;   
        }        
        if( role == 'Admin') {
          this.router.navigate(['/admin']);
          this.spinnerService.hide();
          this.toastr.error("Sesion ya iniciada.");  
          return false;
        }        
        if( role == 'Patient') {
          this.router.navigate(['/patient']);
          this.spinnerService.hide();
          this.toastr.error("Sesion ya iniciada.");
          return false;            
        }  
        this.spinnerService.hide();
        this.toastr.error("Sesion ya iniciada.");  
        return false;
      });
      this.spinnerService.hide();
      return false;      
    } else {        
        this.spinnerService.hide();
        return true;
    }
  }   
}
