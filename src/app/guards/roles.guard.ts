import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolesGuard implements CanActivate {

  constructor(private readonly authService: AuthService,
              private readonly router: Router,) {}

  canActivate(): any {
    this.authService.getUserRole().then
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
