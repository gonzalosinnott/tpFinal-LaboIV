import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Auth } from '@angular/fire/auth';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userData:any;
  day: string;
  days: any[] = [];

  daysData: Array<any> = [
    { name: 'Lunes', value: 'monday' },
    { name: 'Martes', value: 'tuesday' },
    { name: 'Miercoles', value: 'wednesday' },
    { name: 'Jueves', value: 'thursday' },
    { name: 'Viernes', value: 'friday' },
    { name: 'Sabado', value: 'saturday' },
    { name: 'Domingo', value: 'sunday' }   
  ];

  constructor(public authService: AuthService,
              private firestoreService: FirestoreService,
              private toastr: ToastrService,
              private spinnerService: SpinnerService,) {
    
  }

  ngOnInit(): void {
    var user = JSON.parse(localStorage.getItem('userData'));
    this.firestoreService.getUserData(user.uid).subscribe((user: any) => {
      console.log(user[0]);
      this.userData = user[0];
    });
  }

  onCheckboxChange(event: any) {
    if (event.target.checked) {
      this.analizeDay(event.target.value);
      console.log(this.days);
    } else {
      this.days = this.days.filter((item) => item !== event.target.value);
      console.log(this.days);
    }
  }

  analizeDay(day:any) {
    var dayArr = day.split('-');

    if(dayArr[1] == "undefined" || dayArr[2] == "undefined") {
      this.toastr.error("Debe completar los horarios de atención");
      return;
    }   

    if(dayArr[1] > dayArr[2]) {
      this.toastr.error("La hora de inicio no puede ser mayor a la hora de fin");
      return;
    }
    
    if(dayArr[1] == dayArr[2]) {
      this.toastr.error("La hora de inicio no puede ser igual a la hora de fin");
      return;
    }   

    if(dayArr[1] < "08:00") {
      this.toastr.error("La hora de inicio no puede ser por fuera del horario de atencion");
      return;
    } 

    if(dayArr[2] > "18:00") {
      this.toastr.error("La hora de fin no puede ser por fuera del horario de atencion");
      return;
    } 

    this.days.push(day);
  }

  updateServiceHours() {
    this.spinnerService.show();
    this.firestoreService.updateServiceHours(this.userData.uid, this.days)
    .then(() => {
      this.toastr.success("Horarios de atención actualizados");
      this.firestoreService.getUserData(this.userData.uid).subscribe((user: any) => {
        this.userData = user[0];
      })
    })
    .catch((error) => {
      this.toastr.error(error);
    })
    .finally(() => {
      this.spinnerService.hide();
    });
  }


}
