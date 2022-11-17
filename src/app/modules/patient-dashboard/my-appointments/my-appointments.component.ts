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
  styleUrls: ['./my-appointments.component.scss'],
})
export class MyAppointmentsComponent implements OnInit {
  specialtiesList: any;
  selectedSpecialty: any;
  doctors: any;
  selectedDoctor: any;
  user: any;
  userData: any;
  appointments: any;
  specialtySelected: boolean = false;
  doctorSelected: boolean = false;
  appointmentUID: any;
  appointmentStatus: any;
  appointmentInfo: any;
  appointmentDiagnostic: any;
  appointmentRate: number = 0;
  doctorClarity: string = '';
  
  form: FormGroup;
  public cancelReason = new FormControl('');
  public personalOpinion = new FormControl('');


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
    this.getSpecialists();
    this.getUserData();
    this.form = this.fb.group({
      cancelReason: ['', Validators.required],
      personalOpinion: ['', Validators.required],
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
    this.firestore.getSpecialties().subscribe((data: any) => {
      this.specialtiesList = data[0].specialties;
      this.spinnerService.hide();
    });
  }

  getSpecialists() {
    this.spinnerService.show();
    this.firestore.getAllSpecialists().then((data) => {
      this.doctors = data;
      this.spinnerService.hide();
    });
  }

  getAppointmentsBySpecialty() {
    this.spinnerService.show();
    this.firestore
      .getAppointmentsBySpecialtyForPatient(
        this.selectedSpecialty,
        this.userData.displayName
      )
      .then((data) => {
        console.log(data);
        this.appointments = data;
        this.spinnerService.hide();
      });
  }

  getAppointmentsBySpecialist() {
    this.spinnerService.show();
    this.firestore
      .getAppointmentsBySpecialistAndPatient(
        this.selectedDoctor,
        this.userData.displayName
      )
      .then((data) => {
        console.log(data);
        this.appointments = data;
        this.spinnerService.hide();
      });
  }

  selectSpecialty(e: any) {
    this.specialtySelected = true;
    this.doctorSelected = false;
    console.log(e.target.value);
    this.selectedSpecialty = e.target.value;
    this.getAppointmentsBySpecialty();
  }

  selectDoctor(e: any) {
    this.specialtySelected = false;
    this.doctorSelected = true;
    this.selectedDoctor = e.target.value;
    this.getAppointmentsBySpecialist();
  }

  openCancelOrRejectAppointment(appointment: any, status:any) {
    this.appointmentStatus = status;
    this.appointmentUID = appointment;
  }

  cancelAppointment() {
    if (this.cancelReason.value == '') {
      this.toastr.error('Ingrese el motivo de la cancelación');
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
          this.toastr.success('TURNO CANCELADO');
          this.spinnerService.hide();
        })
        .then(() => {
          if (this.specialtySelected) {
            this.getAppointmentsBySpecialty();
          }
          if (this.doctorSelected) {
            this.getAppointmentsBySpecialist();
          }
        })
        .finally(() => {
          this.cancelReason.setValue('');
        });
    }
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

  openSurvey(appointment: any) {
    this.appointmentUID = appointment;
  }

  surveyAppointment() {
    if (this.personalOpinion.value == '') {
      this.toastr.error('Complete todos los campos');
      return;
    }
    
    if (this.doctorClarity == '') {
      this.toastr.error('COmplete todos los campos');
      return;
    }

    if (this.appointmentRate == 0) {
      this.toastr.error('COmplete todos los campos'); 
        return;
    }

    var surveyArr: any[] = [];
    surveyArr.push(this.personalOpinion.value);
    surveyArr.push(this.doctorClarity);
    surveyArr.push(this.appointmentRate);
    console.log(surveyArr);
    
    this.firestore
      .surveyAppointment(this.appointmentUID, surveyArr)
      .then(() => {
        this.toastr.success('ENCUESTA CARGADA CON EXITO');
        this.spinnerService.hide();
      })
      .then(() => {
        if (this.specialtySelected) {
          this.getAppointmentsBySpecialty();
        }
        if (this.doctorSelected) {
          this.getAppointmentsBySpecialist();
        }
      })
      .finally(() => {
        this.personalOpinion.setValue('');
        this.doctorClarity = '';
        this.appointmentRate = 0;
      });   
  }  

  openRateAppointment(appointment: any) {
    this.appointmentUID = appointment;
  }

  rateAppointment() {
    if(this.appointmentRate == 0){
      this.toastr.error('Ingrese una calificación');
    }else{
      this.spinnerService.show();
      this.firestore.rateAppointment(this.appointmentUID, this.appointmentRate).then(() => {
        this.toastr.success('Calificación enviada');
        this.spinnerService.hide();
      }).then(() => {
        if (this.specialtySelected) {
          this.getAppointmentsBySpecialty();
        }
        if (this.doctorSelected) {
          this.getAppointmentsBySpecialist();
        }
      })
    }
  }

  rate(e: any) {
    console.log(e.target.value);
    this.appointmentRate = e.target.value;
  }

  clarity(e: any) {
    console.log(e.target.value);
    this.doctorClarity = e.target.value;
  }
}
