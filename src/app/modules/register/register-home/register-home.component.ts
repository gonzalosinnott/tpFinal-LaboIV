import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-home',
  templateUrl: './register-home.component.html',
  styleUrls: ['./register-home.component.css']
})
export class RegisterHomeComponent implements OnInit {

  imgDtr = '/assets/logos/doctor.png';
  imgPct= '/assets/logos/patient.png';
  
  constructor() { }

  ngOnInit(): void {
  }

}
