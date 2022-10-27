import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Location} from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-patient',
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.css']
})
export class RegisterPatientComponent implements OnInit {

  form: FormGroup;

  formFile:File|null=null;
  formFile2:File|null=null;

  constructor(private _location: Location,
              private fb: FormBuilder,
              private toastr: ToastrService,
              public auth: AuthService,
              private readonly router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [null],
      lastName: [null],
      idNumber: [null],
      age: [null],
      healthInsurance: [null],
      email: [null],
      password: [null],
      password2: [null],
      formFile: [null],
      formFile2: [null],
      role: "PATIENT"
    });
  }

  get password() {
    return this.form.get('password');
  }

  get password2() {
    return this.form.get('password2');
  }

  onSubmit() {   

    if (this.form.valid) {
      if(this.password.value !== this.password2.value) {
        this.toastr.error("Las contraseñas no coinciden");
        return;
      }
      this.auth.registerUser(this.form.value)      
      .then(() =>this.router.navigate(['../login']))
      .catch((e) => this.toastr.error(e.message)); ;
    } else {
      this.toastr.warning('REVISE LOS CAMPOS DEL FORMULARIO' , '', {
        timeOut: 1500,
        positionClass: 'toast-center-center',      
      });
      
    } 
  } 
  
  onFileSelected(event:any, first:boolean) {
    if(first){
      this.formFile=event.target.files[0];
      console.log(this.formFile);
    }else{
      this.formFile2=event.target.files[0];
      console.log(this.formFile2);
    }
  }

  return() {
    this._location.back();
  }
}
