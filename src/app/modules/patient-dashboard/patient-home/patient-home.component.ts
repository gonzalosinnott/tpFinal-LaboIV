import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-patient-home',
  templateUrl: './patient-home.component.html',
  styleUrls: ['./patient-home.component.css']
})
export class PatientHomeComponent implements OnInit {

  userData: any;
  displayName: any;
  user:any;

  constructor(public authService: AuthService,) {
    
   }

  ngOnInit(): void {
    this.authService.getAuth().subscribe(user => {
      if (user) {
        this.user = user;
        this.userData = JSON.parse(localStorage.getItem('userData'));
        this.displayName = this.userData[0].displayName;
      }
    });
  }


}
