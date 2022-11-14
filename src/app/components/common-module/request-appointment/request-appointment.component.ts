import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Auth } from '@angular/fire/auth';


@Component({
  selector: 'app-request-appointment',
  templateUrl: './request-appointment.component.html',
  styleUrls: ['./request-appointment.component.css']
})
export class RequestAppointmentComponent implements OnInit {

  user: any;
  specialty:any;
  doctor:any;
  patient: any;

  constructor(private authService: AuthService,
    private router: Router,
    private readonly Auth: Auth,
    public afAuth: AngularFireAuth,
    private readonly firestore: FirestoreService) { }

  ngOnInit(): void {
    this.setUserType();
  }

  setUserType() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.firestore.getUserRole(this.Auth.currentUser.uid).then((role) => {
            this.user = role;         
        });
      }
      return user;
    });
  }

  selectedSpecialty(code: string) {      
    this.specialty = code;
  } 

  selectedDoctor(code: string) {      
    this.doctor = code;
  } 

  selectedPatient(code: string) {      
    this.patient = code;
  } 
}
