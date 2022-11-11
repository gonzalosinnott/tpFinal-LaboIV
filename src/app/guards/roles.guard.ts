import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class RolesGuard implements CanActivate {

  constructor(private readonly firestore: FirestoreService,
              private readonly router: Router,) {}

  canActivate(): any {
    this.firestore.getUserRole().then
    (role => {
      if (role == 'PATIENT') {
        this.router.navigate(['/patient-dashboard']);
        return true;
      }
      
      if (role == 'DOCTOR') {
        this.router.navigate(['/doctor--dashboard']);
        return true;
      } 

      if( role == 'ADMIN') {
        this.router.navigate(['/admin-dashboard']);
        return true;
      }
      
      this.router.navigate(['/']);
      return false;
    });
    return false
  }
  
}
