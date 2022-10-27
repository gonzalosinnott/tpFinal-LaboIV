import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {Location} from '@angular/common';

@Component({
  selector: 'app-register-doctor',
  templateUrl: './register-doctor.component.html',
  styleUrls: ['./register-doctor.component.css']
})
export class RegisterDoctorComponent implements OnInit {

  form: FormGroup;

  constructor(private _location: Location) {}

  ngOnInit(): void {
  }

  onSubmit() {
    
    
  }

  return() {
    this._location.back();
  }

}
