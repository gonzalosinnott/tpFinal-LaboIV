import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Doctor } from 'src/app/models/doctor';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-register-doctor',
  templateUrl: './register-doctor.component.html',
  styleUrls: ['./register-doctor.component.css']
})
export class RegisterDoctorComponent implements OnInit {

  form: FormGroup;
  file: File | null = null;
  isSpecialist: boolean = false;
  user = new User();
  doctor = new Doctor();
  rePassword: string = '';
  specialties: any[] = [];
  public extraSpecialty = new FormControl('');
  specialtiesList: any;

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
      extraSpecialty: [''],
      approved: false,
    });

    this.getSpecialties();
  }

  getValue(value: string): AbstractControl {
    return this.form.get(value) as FormGroup;
  }

  getSpecialties() {
    this.spinnerService.show();
    this.firestore.getSpecialties().subscribe((data:any) => {
      this.specialtiesList = data[0].specialties;
      this.spinnerService.hide();
    });
  }

  addSpecialty() {
    if (this.extraSpecialty.value !== '') {
      this.spinnerService.show();
      this.specialtiesList.push(this.extraSpecialty.value);

      this.firestore.updateSpecialties(this.specialtiesList).then(() => {
        this.toastr.success('Especialidad agregada con éxito');
      })
      .catch((e) => {
        this.toastr.error('Error al agregar especialidad');
      })
      .finally(() => {
        this.spinnerService.hide();
      });
      this.extraSpecialty.setValue('');
    }
  }

  registerDoctor() {
    this.user = this.form.value;
    this.user.specialties = this.specialties;
    this.user.approved = false;
    this.user.role = 'Doctor';
    this.spinnerService.show();

    if (this.doctor.password === this.rePassword) {
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

  onCheckboxChange(event: any) {
    if (event.target.checked) {
      this.specialties.push(event.target.value);
    } else {
      this.specialties = this.specialties.filter((item) => item !== event.target.value);
    }
  }
}
