import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.css'],
})
export class MyAppointmentsComponent implements OnInit {
  specialtiesList: any;
  selectedSpecialty: any;
  patients: any;
  selectedPatient: any;
  user: any;
  userData: any;
  appointments: any;
  specialtySelected: boolean = false;
  patientSelected: boolean = false;
  appointmentUID: any;
  appointmentStatus: any;
  appointmentInfo: any;
  appointmentDiagnostic: any;

  form: FormGroup;
  public cancelReason = new FormControl('');
  public comment = new FormControl('');
  public diagnostic = new FormControl('');

  constructor(
    private toastr: ToastrService,
    private spinnerService: SpinnerService,
    public auth: AuthService,
    public firestore: FirestoreService,
    public storage: StorageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userData'));
    this.getSpecialties();
    this.getPatients();
    this.getUserData();
    this.form = this.fb.group({
      cancelReason: ['', Validators.required],
      comment: ['', Validators.required],
      diagnostic: ['', Validators.required],
    });
  }

  getUserData() {
    this.firestore.getUserData(this.user.uid).subscribe((user: any) => {
      console.log(user);
      this.userData = user[0];
    });
  }

  getSpecialties() {
    this.spinnerService.show();
    this.firestore.getSpecialtiesByDoctor(this.user.uid).then((res: any) => {
      this.specialtiesList = res;
      this.spinnerService.hide();
    });
  }

  getPatients() {
    this.spinnerService.show();
    this.firestore.getAllPatients().then((data) => {
      this.patients = data;
      this.spinnerService.hide();
    });
  }

  getAppointmentsBySpecialty() {
    this.spinnerService.show();
    this.firestore
      .getAppointmentsBySpecialtyForDoctor(
        this.selectedSpecialty,
        this.userData.displayName
      )
      .then((data) => {
        console.log(data);
        this.appointments = data;
        this.spinnerService.hide();
      });
  }

  getAppointmentsByPatient() {
    this.spinnerService.show();
    this.firestore
      .getAppointmentsBySpecialistAndPatient(
        this.userData.displayName,
        this.selectedPatient        
      )
      .then((data) => {
        console.log(data);
        this.appointments = data;
        this.spinnerService.hide();
      });
  }

  selectSpecialty(e: any) {
    this.specialtySelected = true;
    this.patientSelected = false;
    console.log(e.target.value);
    this.selectedSpecialty = e.target.value;
    this.getAppointmentsBySpecialty();
  }

  selectDoctor(e: any) {
    this.specialtySelected = false;
    this.patientSelected = true;
    this.selectedPatient = e.target.value;
    this.getAppointmentsByPatient();
  }

  openCancelOrRejectAppointment(appointment: any, status:any) {
    this.appointmentStatus = status;
    this.appointmentUID = appointment;
  }

  openCloseAppointment(appointment: any, status:any) {
    this.appointmentStatus = status;
    this.appointmentUID = appointment;
  }

  cancelOrRejectAppointment() {
    if (this.cancelReason.value == '') {
      this.toastr.error('Ingrese el motivo de la cancelación/rechazo');
    } else {
      this.spinnerService.show();
      var role
      if(this.userData.role == 'Patient'){
        role = 'Paciente'
      }else if (this.userData.role == 'Doctor'){
        role = 'Especialista'
      }
      else if (this.userData.role == 'Admin'){
        role = 'Administrador'
      }
      var reason = role + ' ' + this.userData.displayName + ': ' + this.cancelReason.value;
      this.firestore
        .changeAppointmentStatus(this.appointmentUID, reason, this.appointmentStatus, '')
        .then(() => {
          this.toastr.success('TURNO CANCELADO/RECHAZADO');
          this.spinnerService.hide();
        })
        .then(() => {
          if (this.specialtySelected) {
            this.getAppointmentsBySpecialty();
          }
          if (this.patientSelected) {
            this.getAppointmentsByPatient();
          }
        })
        .finally(() => {
          this.cancelReason.setValue('');
        });
    }
  }

  closeAppointment() {
    if (this.comment.value == '' || this.diagnostic.value == '') {
      this.toastr.error('Complete todo el formulario');
    } else {
      this.spinnerService.show();
      var role
      if(this.userData.role == 'Patient'){
        role = 'Paciente'
      }else if (this.userData.role == 'Doctor'){
        role = 'Especialista'
      }
      else if (this.userData.role == 'Admin'){
        role = 'Administrador'
      }
      var comment = role + ' ' + this.userData.displayName + ': ' + this.comment.value;
      this.firestore
        .changeAppointmentStatus(this.appointmentUID, comment, this.appointmentStatus, this.diagnostic.value)
        .then(() => {
          this.toastr.success('TURNO FINALIZADO');
          this.spinnerService.hide();
        })
        .then(() => {
          if (this.specialtySelected) {
            this.getAppointmentsBySpecialty();
          }
          if (this.patientSelected) {
            this.getAppointmentsByPatient();
          }
        })
        .finally(() => {
          this.cancelReason.setValue('');
        });
    }
  }

  acceptAppointment(appointmentUID: any, status: any) {    
    this.spinnerService.show();
    this.appointmentStatus = 'accepted';
    this.firestore
      .changeAppointmentStatus(appointmentUID, '', status, '')
      .then(() => {
        this.toastr.success('TURNO ACEPTADO');
        this.spinnerService.hide();
      })
      .then(() => {
        if (this.specialtySelected) {
          this.getAppointmentsBySpecialty();
        }
        if (this.patientSelected) {
          this.getAppointmentsByPatient();
        }
      })
      .finally(() => {
        this.cancelReason.setValue('');
      });    
  }

  openInfoAppointment(appointment: any) {
    console.log(appointment);
    this.spinnerService.show();
    this.firestore.getAppointmentData(appointment).subscribe((appointment: any) => {
      console.log(appointment[0]);
      this.appointmentDiagnostic = appointment[0].diagnosis;
      this.appointmentInfo = appointment[0].appointmentInfo;
      this.appointmentStatus = appointment[0].status;
      this.spinnerService.hide();       
    });
  }
  
}
