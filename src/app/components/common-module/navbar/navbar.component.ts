import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Auth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  userType: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private readonly Auth: Auth,
    public afAuth: AngularFireAuth,
    private readonly firestore: FirestoreService
  ) {}

  ngOnInit(): void {
    this.setUserType();
  }

  setUserType() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.firestore.getUserRole(this.Auth.currentUser.uid).then((role) => {
          if (role == 'Admin') {
            this.userType = 'ADMINISTRADOR';
          }
          if (role == 'Doctor') {
            this.userType = 'PROFESIONAL';
          }
          if (role == 'Patient') {
            this.userType = 'PACIENTE';
          }
          return 'Unknown';
        });
        return 'Unknown';
      } else {
        this.userType = 'Unknown';
      }
      return 'Unknown';
    });
  }

  logout() {
    sessionStorage.clear();
    this.authService
      .logout()
      .then(() => this.router.navigate(['/']))
      .catch((e) => console.log(e.message));
  }
}
