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
    });
  }
  
  ngOnInit(): void {
    sessionStorage.clear();
    localStorage.clear();
    this.form = this.fb.group({
      email: ['', Validators.pattern("^[^@]+@[^@]+\.[a-zA-Z]{2,}$")],
      password: ['', [Validators.minLength(6), Validators.maxLength(20)]]
    });
  }

  onSubmit() {
    this.ingresar(this.form.value);
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
