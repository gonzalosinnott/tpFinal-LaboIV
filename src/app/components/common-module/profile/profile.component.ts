import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Auth } from '@angular/fire/auth';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userData:any;

  constructor(public authService: AuthService,
              private firestoreService: FirestoreService,) {
    
   }

  ngOnInit(): void {
    var user = JSON.parse(localStorage.getItem('userData'));
    this.firestoreService.getUserData(user.uid).subscribe((user: any) => {
      console.log(user[0]);
      this.userData = user[0];
    });
  }
}
