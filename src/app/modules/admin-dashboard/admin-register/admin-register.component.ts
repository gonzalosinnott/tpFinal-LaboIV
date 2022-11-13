import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Admin } from 'src/app/models/admin';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.css']
})
export class AdminRegisterComponent implements OnInit {

  form: FormGroup;
  file: File | null = null;
  isSpecialist: boolean = false;
  user = new User();
  admin = new Admin();
  rePassword: string = '';

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private spinnerService: SpinnerService,
              public auth: AuthService,
              public firestore: FirestoreService,
              public storage: StorageService) {
    this.form = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
      rePassword: new FormControl(),
      name: new FormControl(),
      lastName: new FormControl(),
      age: new FormControl(),
      dni: new FormControl(),
      insurance: new FormControl(),
      specialties: this.fb.array([]),
      approved: new FormControl()
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.pattern('^[^@]+@[^@]+.[a-zA-Z]{2,}$')],
      password: ['', [Validators.minLength(6), Validators.maxLength(20)]],
      rePassword: ['', [Validators.minLength(6), Validators.maxLength(20)]],
      name: ['', [Validators.minLength(6), Validators.maxLength(20)]],
      lastName: ['', [Validators.minLength(6), Validators.maxLength(20)]],
      age: ['', [Validators.max(120), Validators.min(18)]],
      dni: ['', [Validators.minLength(8), Validators.maxLength(8)]],
      insurance: [''],
      specialties: [''],    
      approved: true,
    });
  }

  getValue(value: string): AbstractControl {
    return this.form.get(value) as FormGroup;
  }

  registerAdmin() {
    this.user = this.form.value;
    this.user.approved = true;
    this.user.role = 'Admin';
    this.spinnerService.show();

    if (this.admin.password === this.rePassword) {
      this.auth
          .register(this.user, this.file)
          .then((res) => {})
          .catch((e) => {
          this.toastr.error(e.message);
          this.toastr.error(e.message);
        })
        .finally(() => {
          this.spinnerService.hide();
        });
    } else {
      this.spinnerService.hide();
      this.toastr.error('Las contraseñas no coinciden');
    }
  }

  uploadImage($event: any) {
    this.file = $event.target.files;
    console.log(this.file);
  }
}
