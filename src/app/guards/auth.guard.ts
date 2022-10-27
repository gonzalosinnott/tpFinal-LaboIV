import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivate, Router } from '@angular/router';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private readonly router: Router,
              public afAuth: AngularFireAuth) {}

  canActivate(): any {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false; 
      }
    });   
  }  
}
