import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../services/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class UnloggedGuard implements CanActivate {

  constructor(private readonly router: Router,
              public afAuth: AngularFireAuth,
              private spinnerService: SpinnerService,
              private toastr: ToastrService) {
    this.spinnerService.show(); 
  }

  canActivate(): any {
    this.afAuth.authState.subscribe((user) => {
      console.log(user);
      if (user) {
        return true;
      } else {
        this.router.navigate(['/login']);
        this.spinnerService.hide();
        return false; 
      }
    });   
  }  
}
