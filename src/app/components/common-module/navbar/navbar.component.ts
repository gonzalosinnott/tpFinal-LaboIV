import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userType: any;

  constructor(private authService: AuthService, 
              private router: Router) {}

  ngOnInit(): void {
    this.setUserType();
  }

  setUserType() {
    var user = JSON.parse(localStorage.getItem('userData'));
    if(user[0].role == 'Admin') {
      this.userType = 'ADMINISTRADOR';
    } else if(user[0].role == 'Patient') {
      this.userType = 'PACIENTE';
    } else if(user[0].role == 'Doctor') {
      this.userType = 'PROFESIONAL';
    }
  }
  
  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.authService
        .logout()
        .then(() => this.router.navigate(['/']))
        .catch((e) => console.log(e.message));
  }

}
