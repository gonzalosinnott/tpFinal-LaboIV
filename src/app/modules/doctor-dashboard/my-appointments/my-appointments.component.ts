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
  styleUrls: ['./my-appointments.component.css'],
})
export class MyAppointmentsComponent implements OnInit {
  specialtiesList: any;
  selectedSpecialty: any;
  patients: any;
  selectedPatient: any;
  user: any;
  userData: any;
  appointments: any = [];
  specialtySelected: boolean = false;
  patientSelected: boolean = false;
  appointmentsBySpecialist: any;
  appointmentUID: any;
  appointmentStatus: any;
  appointmentInfo: any;
  appointmentDiagnostic: any;
  appointmentAditionalInfo: any;
  patientsBySpecialist: any = [];

  allAppointments: any;
  searchValue: string = '';

  form: FormGroup;
  public cancelReason = new FormControl('');
  public height = new FormControl('');
  public weight = new FormControl('');
  public temp = new FormControl('');
  public pressure = new FormControl('');
  public field1Key = new FormControl('');
  public field1Value = new FormControl('');
  public field2Key = new FormControl('');
  public field2Value = new FormControl('');
  public field3Key = new FormControl('');
  public field3Value = new FormControl('');
  public field4Key = new FormControl('');
  public field5Key = new FormControl('');
  public field5Value = new FormControl('');
  public field6Key = new FormControl('');
  public comment = new FormControl('');
  public diagnostic = new FormControl('');

  field4Value: any;
  field6Value: string = "NO";

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
      comment: ['', Validators.required],
      diagnostic: ['', Validators.required],
      field1Key: [''],
      field1Value: [''],
      field2Key: [''],
      field2Value: [''],
      field3Key: [''],
      field3Value: [''],
      field4Key: [''],
      field5Key: [''],
      field5Value: [''],
      field6Key: [''],
      height: [''],
      weight: [''],
      temp: [''],
      pressure: [''],
    });
  }

  getUserData() {
    this.firestore.getUserData(this.user.uid)
    .then((user: any) => {
      this.userData = user;
    })
    .then(() => {
      this.getPatients();
      this.getSpecialties();
    })
    .then(() => {
      this.firestore.getAppointmentsBySpecialist(this.userData.displayName)
      .then((data) => {
        this.allAppointments = data;
      });
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
    this.firestore.getAllPatients()
    .then((data) => {
      this.patients = data;
    })
    .then(() => {
      this.firestore.getAppointmentsBySpecialist(this.userData.displayName)
      .then((data) => {
        this.appointmentsBySpecialist = data;})
      .then(() => {
        this.patients.forEach((patient: any) => {
          this.appointmentsBySpecialist.forEach((appointment: any) => {
            if (patient.displayName == appointment.patient) {
              this.patientsBySpecialist.push(patient);
            }
          });
        });
      })
      .then(() => {
        this.patientsBySpecialist = this.removeDuplicates(this.patientsBySpecialist)
        });
    })
    .finally(() => {
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

  openCancelOrRejectAppointment(appointment: any, status: any) {
    this.appointmentStatus = status;
    this.appointmentUID = appointment;
  }

  openCloseAppointment(appointment: any, status: any) {
    this.appointmentStatus = status;
    this.appointmentUID = appointment;
  }

  cancelOrRejectAppointment() {
    if (this.cancelReason.value == '') {
      this.toastr.error('Ingrese el motivo de la cancelación/rechazo');
    } else {
      this.spinnerService.show();
      var role;
      if (this.userData.role == 'Patient') {
        role = 'Paciente';
      } else if (this.userData.role == 'Doctor') {
        role = 'Especialista';
      } else if (this.userData.role == 'Admin') {
        role = 'Administrador';
      }
      var reason =
        role + ' ' + this.userData.displayName + ': ' + this.cancelReason.value;
      this.firestore
        .changeAppointmentStatus(
          this.appointmentUID,
          reason,
          this.appointmentStatus,
          '',
          ''
        )
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
    if (
      this.comment.value == '' ||
      this.diagnostic.value == '' ||
      this.height.value == '' ||
      this.weight.value == '' ||
      this.temp.value == '' ||
      this.pressure.value == ''
    ) {
      this.toastr.error(
        'Complete todos los datos obligatorios del el formulario'
      );
    } else {
      this.spinnerService.show();

      var comment =
        'Especialista' +
        ' ' +
        this.userData.displayName +
        ': ' +
        this.comment.value;

      var appointmentUID = this.appointmentUID.split('-');
      var patient = appointmentUID[3];

      this.saveAppointmentMedicalHistory(
        patient,
        this.height.value,
        this.weight.value,
        this.temp.value,
        this.pressure.value
      );
      
      this.saveAppointmentComment(comment);
    }
  }

  saveAppointmentComment(comment: any) {

    let observations = new Map<string,string>();

    if(this.field1Key.value != '' && this.field1Value.value != ''){
      observations.set(this.field1Key.value, this.field1Value.value);
    }

    if(this.field2Key.value != '' && this.field2Value.value != ''){
      observations.set(this.field2Key.value, this.field2Value.value);
    }

    if(this.field3Key.value != '' && this.field3Value.value != ''){
      observations.set(this.field3Key.value, this.field3Value.value);
    }

    if(this.field4Key.value != ''){
      observations.set(this.field4Key.value, this.field4Value);
    }

    if(this.field5Key.value != '' && this.field5Value.value != ''){
      observations.set(this.field5Key.value, this.field5Value.value);
    }

    if(this.field6Key.value != ''){
      observations.set(this.field6Key.value, this.field6Value.toString());
    }

    const obj = Object.fromEntries(observations);

    this.firestore
      .changeAppointmentStatus(
        this.appointmentUID,
        comment,
        this.appointmentStatus,
        this.diagnostic.value,
        obj
      )
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

  saveAppointmentMedicalHistory(
    patient: any,
    height: any,
    weight: any,
    temp: any,
    pressure: any
  ) {
    this.firestore.addMedicalHistory(
      patient,
      height,
      weight,
      temp,
      pressure,
    );    
  }

  acceptAppointment(appointmentUID: any, status: any) {
    this.spinnerService.show();
    this.appointmentStatus = 'accepted';
    this.firestore
      .changeAppointmentStatus(appointmentUID, '', status, '', '')
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
        this.field1Key.setValue('');
        this.field1Value.setValue('');
        this.field2Key.setValue('');
        this.field2Value.setValue('');
        this.field3Key.setValue('');
        this.field3Value.setValue('');
        this.field4Key.setValue('');
        this.field4Value = '';
        this.field5Key.setValue('');
        this.field5Value.setValue('');
        this.field6Key.setValue('');
        this.field6Value = 'NO';
        this.cancelReason.setValue('');
      });
  }

  openInfoAppointment(appointment: any) {
    console.log(appointment);
    this.spinnerService.show();
    this.firestore
      .getAppointmentData(appointment)
      .subscribe((appointment: any) => {
        console.log(appointment[0]);
        this.appointmentDiagnostic = appointment[0].diagnosis;
        this.appointmentInfo = appointment[0].appointmentInfo;
        this.appointmentStatus = appointment[0].status;
        this.appointmentAditionalInfo = appointment[0].observations;
        this.spinnerService.hide();
      });
  }

  setField4Value(e: any) {
    console.log(e.target.value);
    this.field4Value = e.target.value;
  }

  setField6Value(e: any) {
    if (this.field6Value == 'NO') {
      this.field6Value = 'SI';
    } else {
      this.field6Value = 'NO';
    }
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
