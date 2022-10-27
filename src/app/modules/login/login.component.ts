import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  role: string;

  constructor(private fb: FormBuilder,
              private readonly authService: AuthService,
              private readonly router: Router,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  onSubmit() {
    this.authService
        .login(this.form.value)
        .then(() =>this.redirect())
        .catch((e) => this.toastr.error(e.message));
  }

  redirect() {
    this.authService.getUserRole().then
    (role => {
      if (role == 'PATIENT') {
        this.router.navigate(['/patient-dashboard']);
      }
      
      if (role == 'DOCTOR') {
        this.router.navigate(['/doctor-dashboard']);
      } 

      if(role == 'ADMIN') {
        this.router.navigate(['/admin-dashboard']);
      } 
    });
  }

  fillFormPatient1() : void {
    this.form = this.fb.group({
      email: ['patient@mail.com'],
      password: ['123456'],
    });
  }

  fillFormPatient2() : void {
    this.form = this.fb.group({
      email: ['patient2@mail.com'],
      password: ['123456'],
    });
  }

  fillFormPatient3() : void {
    this.form = this.fb.group({
      email: ['patient3@mail.com'],
      password: ['123456'],
    });
  }

  fillFormDoctor1() : void {
    this.form = this.fb.group({
      email: ['doctor1@mail.com'],
      password: ['123456'],
    });
  }

  fillFormDoctor2() : void {
    this.form = this.fb.group({
      email: ['doctor2@mail.com'],
      password: ['123456'],
    });
  }

  fillFormAdmin() : void {
    this.form = this.fb.group({
      email: ['gonzalo.sinnott@gmail.com'],
      password: ['123456'],
    });
  }

}
