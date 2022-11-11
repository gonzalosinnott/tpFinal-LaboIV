import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userData: any;
  displayName: any;
  user:any;

  constructor(public authService: AuthService,) {
    
   }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.displayName = this.userData[0].displayName;
    this.user = this.userData[0];
  }

}
