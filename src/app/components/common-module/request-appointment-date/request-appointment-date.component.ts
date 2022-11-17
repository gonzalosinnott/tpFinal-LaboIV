import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { StorageService } from 'src/app/services/storage.service';
import { Auth } from '@angular/fire/auth';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-request-appointment-date',
  templateUrl: './request-appointment-date.component.html',
  styleUrls: ['./request-appointment-date.component.css'],
})
export class RequestAppointmentDateComponent implements OnInit {
  @Input() doctor = '';
  @Input() patient = '';
  @Input() specialty = '';
  doctorAvailability: any[] = [];
  selectedDate: any;
  appointments: any[] = [];
  user: any;
  userData: any;
  doctorName: any;
  patientName: any;

  constructor(
    private toastr: ToastrService,
    private spinnerService: SpinnerService,
    public auth: AuthService,
    public firestore: FirestoreService,
    public storage: StorageService,
    private router: Router,
    private readonly Auth: Auth,
    public afAuth: AngularFireAuth) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userData'));
    this.getUserData();
  }

  getUserData() {
    this.firestore.getUserData(this.user.uid).subscribe((user: any) => {
      this.userData = user[0];
    });
  } 

  ngOnChanges(changes: SimpleChanges) {

   if(changes['specialty'] !== undefined) {
      this.specialty=changes['specialty'].currentValue;
      this.doctor = '';
    }

    if(changes['doctor'] !== undefined) {
      this.doctor=changes['doctor'].currentValue;
    }

    if(changes['patient'] !== undefined) {
      this.patient=changes['patient'].currentValue;
    }

    if(changes['selectedDate'] !== undefined) {
      this.patient=changes['selectedDate'].currentValue;
    }
    
    if(this.userData.role == "Patient") 
    {
      this.patient = this.user.uid;
    }

    this.appointments = [];
    this.spinnerService.show();
    this.firestore.getDoctorAvailableHours(this.doctor)
    .then((data) => { this.doctorAvailability = data; })
    .then(() => { this.generateDaysData(this.doctorAvailability); })
    .then(() => { this.checkDoctorAvailability(this.doctor) })
    .then(() => { })
    .then(() => { this.checkPatientAvailability(this.patient) })
    .then(() => { this.firestore.getUserData(this.doctor).subscribe((user: any) => {
                      this.doctorName= user[0].displayName;});
    })
    .then(() => { this.firestore.getUserData(this.patient).subscribe((user: any) => {
                      this.patientName= user[0].displayName;});
    })
    .finally(() => { this.spinnerService.hide();});
  }

  generateDaysData(data) {
    var day:any;
    var startHour:any;
    var endHour:any;
    
    for(let i = 0; i < data.length; i++) {
      var dayArr = data[i].split('-');
      day = dayArr[0];
      startHour = dayArr[1];
      endHour = dayArr[2];
      this.generateDays(day, startHour, endHour);
    }
  }

  //generate half hour increment times between one hour and another
  generateDates(startHour: any, endHour: any) {
    var times: any[] = [];
    var startHourArr = startHour.split(':');
    var endHourArr = endHour.split(':');
    var startHourNumber = parseInt(startHourArr[0]);
    var endHourNumber = parseInt(endHourArr[0]);
    var startMinuteNumber = parseInt(startHourArr[1]);
    var hour = startHourNumber;
    var minute = startMinuteNumber;
    var time = '';

    while(hour < endHourNumber) {
      if(minute == 0) {
        time = hour + ':' + minute + '0';
      } else {
        time = hour + ':' + minute;
      }
      times.push(time);
      minute += 30;
      if(minute == 60) {
        hour += 1;
        minute = 0;
      }
    }
    return times;
  }
  
  //generate date for a given day of the week for the next 15 days
  generateDays(day: any, startHour: any, endHour: any) {
    var hours = this.generateDates(startHour, endHour);
    var date = new Date();
    var dates: any[] = [];
    var dayOfWeek = date.getDay();
    var dayOfWeekNumber = this.getDayOfWeekNumber(day);
    var daysToAdd = dayOfWeekNumber - dayOfWeek;
    if (daysToAdd < 0) {
      daysToAdd += 7;
    }
    date.setDate(date.getDate() + daysToAdd);
    for (let i = 0; i < 2; i++) {
      for(let j = 0; j < hours.length; j++) {
        this.appointments.push(new Date(date).toLocaleDateString('es-es', { month:"numeric", day:"numeric"}) + ' ' + hours[j]);
      }
      date.setDate(date.getDate() + 7);
    }
  }

  getDayOfWeekNumber(day: any) {
    switch (day) {
      case 'monday':
        return 1;
      case 'tuesday':
        return 2;
      case 'wednesday':
        return 3;
      case 'thursday':
        return 4;
      case 'friday':
        return 5;
      case 'saturday':
        return 6;
        default:
        return 0;
    }
  }

  checkDoctorAvailability(doctor:any) {
    this.firestore.searchDoctorAvailability(doctor)
    .then((data) => { 
      const newArray = this.appointments.filter((element) => {
        return element !== data.date;
      });
      this.appointments = newArray; 
    })
  }

  checkPatientAvailability(patient:any) {
    this.firestore.searchPatientAvailability(patient)
    .then((data) => { 
      const newArray = this.appointments.filter((element) => {
        return element !== data.date;
      });
      this.appointments = newArray; 
    })
  }

  selectApointment(e: any) {
    this.selectedDate = e.target.value;
  }
  
  createAppointment() {
    
    if(this.doctorName == undefined) {
      this.toastr.error('Seleccione todos los campos', 'Error');
      return;
    }
    

    if(this.patientName == undefined) {
      this.toastr.error('Seleccione todos los campos', 'Error');
      return;
    }

    this.spinnerService.show();
    
    this.firestore.addAppointment(this.selectedDate, this.doctorName, this.patientName,  this.specialty)
    .then(() => { this.toastr.success('Cita creada', 'Éxito'); })
    .catch((error) => { this.toastr.error(error, 'Error'); })
    .finally(() => {  location.reload();
                      this.spinnerService.hide();
                     
     });  


  }
}
