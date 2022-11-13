import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  usuario = new User();

  constructor(private auth: AuthService,
              private readonly fb: FormBuilder, 
              private spinnerService: SpinnerService,
              private toastr: ToastrService) {                
    this.form = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  getValue(value: string): AbstractControl {
    return this.form.get(value) as FormGroup;
  }

  ingresar(user: User) {
    this.spinnerService.show();
    this.auth.login(user.email, user.password).then(res => { 
    })
    .catch(e => { this.toastr.error(e.message) })
    .finally(() => {
      this.spinnerService.hide(); 
    });
  }
  
  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.pattern("^[^@]+@[^@]+\.[a-zA-Z]{2,}$")],
      password: ['', [Validators.minLength(6), Validators.maxLength(20)]]
    });
  }

  onSubmit() {
    this.spinnerService.show();
    this.ingresar(this.form.value);
  }

  fillFormPatient1() : void {
    this.form = this.fb.group({
      email: ['78d2bdafce@inboxmail.life'],
      password: ['123456'],
    });
  }

  fillFormPatient2() : void {
    this.form = this.fb.group({
      email: ['8ab4d5d3db@inboxmail.life'],
      password: ['123456'],
    });
  }

  fillFormPatient3() : void {
    this.form = this.fb.group({
      email: ['c0793610b3@inboxmail.life'],
      password: ['123456'],
    });
  }

  fillFormDoctor1() : void {
    this.form = this.fb.group({
      email: ['9c5ec15f0d@inboxmail.life'],
      password: ['123456'],
    });
  }

  fillFormDoctor2() : void {
    this.form = this.fb.group({
      email: ['649393bf2f@inboxmail.life'],
      password: ['123456'],
    });
  }

  fillFormAdmin() : void {
    this.form = this.fb.group({
      email: ['9d27924836@inboxmail.life'],
      password: ['123456'],
    });
  }
}
