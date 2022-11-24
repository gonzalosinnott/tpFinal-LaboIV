import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppointmentStatusPipe } from 'src/app/pipes/appointmentStatus.pipe';
import { SpecialtiesPipe } from 'src/app/pipes/specialties.pipe';
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
  specialtiesByPatient: any = [] ;
  selectedSpecialty: any;
  doctors: any;
  doctorsByPatient: any = [] ;
  selectedDoctor: any;
  user: any;
  userData: any;
  appointments: any;
  appointmentsByPatient: any;
  specialtySelected: boolean = false;
  doctorSelected: boolean = false;
  appointmentUID: any;
  appointmentStatus: any;
  appointmentInfo: any;
  appointmentDiagnostic: any;
  appointmentAditionalInfo: any;
  appointmentRate: number = 0;
  doctorClarity: string = '';

  allAppointments: any;
  searchValue: string = '';
  
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
    this.getUserData();
    this.form = this.fb.group({
      cancelReason: ['', Validators.required],
      personalOpinion: ['', Validators.required],
    });
  }

  getUserData() {
    this.firestore.getUserData(this.user.uid)
    .then((user: any) => {
      this.userData = user;
    })
    .then(() => {
      this.getSpecialists();
      this.getSpecialties();
    })
    .then(() => {
      this.firestore.getAppointmentsByPatient(this.userData.displayName)
      .then((data) => {
        this.allAppointments = data;
      });
    });
  }

  getSpecialties() {
    this.spinnerService.show();
    this.firestore.getSpecialties()
    .then((data: any) => {
      this.specialtiesList = data[0].specialties;
    })
    .then(() => {
      this.firestore.getAppointmentsByPatient(this.userData.displayName)
      .then((appointments) => {
        this.appointmentsByPatient = appointments;
      })
      .then(() => {
        this.specialtiesList.forEach((specialty: any) => {
          this.appointmentsByPatient.forEach((appointment: any) => {
            if(specialty == appointment.specialty) {
              this.specialtiesByPatient.push(specialty);
            }
          });
        });
      })
      .then(() => {
        this.specialtiesByPatient = this.removeDuplicates(this.specialtiesByPatient);
      })
      .finally(() => {
        this.spinnerService.hide();
      });
    })     
  }

  getSpecialists() {
    this.doctorsByPatient = [];
    this.spinnerService.show();
    this.firestore.getAllSpecialists()
    .then((data) => {
      this.doctors = data;
    })
    .then(() => {
      this.firestore.getAppointmentsByPatient(this.userData.displayName)
      .then((data) => {
        this.appointmentsByPatient = data;})
      .then(() => {
        this.doctors.forEach((doctor: any) => {
          this.appointmentsByPatient.forEach((appointment: any) => {
            if(doctor.displayName == appointment.doctor) {
              this.doctorsByPatient.push(doctor);
            }
          });
        });
      })
      .then(() => {
        this.doctorsByPatient = this.removeDuplicates(this.doctorsByPatient);
      });
    })
    .then(() => {
      this.spinnerService.hide();
    });      
  }

  removeDuplicates(arr: any) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
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
        .changeAppointmentStatus(this.appointmentUID, reason, this.appointmentStatus, '', '')
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
      this.appointmentAditionalInfo = appointment[0].observations;
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

  search() {

    this.appointments = [];
    let appointmentInfo = ''; 
    let date = '';
    let diagnosis = '';
    let doctor = '';
    let patient = '';
    let status = '';
    let statusFormated = '';
    let specialty = '';
    let specialtyFormated = '';
    let observations = '';
    let observationsFormated = ''; 

    if(this.searchValue == ''){
      this.toastr.error('Ingrese un criterio de busqueda');
      return;
    }
        
    this.allAppointments.forEach(element => {

      if(element.appointmentInfo!=undefined) {
        appointmentInfo = element.appointmentInfo.toString().toLowerCase();
      }

      if (element.date!=undefined) {
        date = element.date.toString().toLowerCase();
      }

      if (element.diagnosis!=undefined) {
        diagnosis = element.diagnosis.toString().toLowerCase();
      }
      
      if (element.doctor!=undefined) {
        doctor = element.doctor.toString().toLowerCase();
      }

      if (element.patient!=undefined) {
        patient = element.patient.toString().toLowerCase();
      }

      if (element.specialty!=undefined) {
        specialty = element.specialty;
        specialtyFormated = new SpecialtiesPipe().transform(specialty).toString().toLowerCase();
      }

      if (element.status!=undefined) {
        status = element.status;
        statusFormated = new AppointmentStatusPipe().transform(status).toString().toLowerCase();
      }

      if (element.observations!=undefined) {
        observations = element.observations;
        observationsFormated = JSON.stringify(observations).toString().toLowerCase();
      }

      if(appointmentInfo.includes(this.searchValue.toLowerCase()) ||
         date.includes(this.searchValue.toLowerCase()) ||
         diagnosis.includes(this.searchValue.toLowerCase()) ||
         doctor.includes(this.searchValue.toLowerCase()) ||
         patient.includes(this.searchValue.toLowerCase()) ||
         specialtyFormated.includes(this.searchValue.toLowerCase()) ||
         statusFormated.includes(this.searchValue.toLowerCase()) ||
         observationsFormated.includes(this.searchValue.toLowerCase())){
        this.appointments.push(element);
      }     
    });

    this.searchValue = '';  
  }
}
