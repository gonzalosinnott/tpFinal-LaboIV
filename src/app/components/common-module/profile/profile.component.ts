import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Auth } from '@angular/fire/auth';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from 'src/app/services/spinner.service';
import { SpecialtiesPipe } from 'src/app/pipes/specialties.pipe';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  patientMedicalHistory: any;
  patientAppointments: any;
  patientAppointmentsBySpecialty: any;
  specialtiesList: any[] = [];
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
              private spinnerService: SpinnerService,
              private pipe: SpecialtiesPipe) {
    
  }

  ngOnInit(): void {
    this.spinnerService.show();
    var user = JSON.parse(localStorage.getItem('userData'));
    this.firestoreService.getUserData(user.uid)
    .then((user: any) => {
      this.userData = user;
    })
    .then(() => {
      if(this.userData.role == 'Patient'){
        this.firestoreService.getAppointmentsByPatient(this.userData.displayName)
        .then((appointments: any) => {
          this.patientAppointments = appointments;
        })
        .then(() => {
          this.firestoreService.getMedicalHistoryByPatient(this.userData.displayName)
          .then((medicalHistory: any) => {
            this.patientMedicalHistory = medicalHistory[0];
          })
        })
        .then(() => {
          this.patientAppointments.forEach(element => {
            this.specialtiesList.push(element.specialty);        
          });
        })
        .then(() => {          
          this.specialtiesList = this.removeDuplicates(this.specialtiesList)             
        });
      }
    })
    .finally(() => {
      this.spinnerService.hide();
    });    
  }

  removeDuplicates(arr: any) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
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
      this.firestoreService.getUserData(this.userData.uid)
      .then((user: any) => {
        this.userData = user;
      })
    })
    .catch((error) => {
      this.toastr.error(error);
    })
    .finally(() => {
      this.spinnerService.hide();
    });
  }

  selectSpecialty(specialty: any) {

    let specialtyFormated = new SpecialtiesPipe().transform(specialty);
    console.log(specialtyFormated);

    this.firestoreService.getMedicalHistoryBySpecialtyAndPatient(specialty, this.userData.displayName)
    .then((medicalHistory: any) => {
      this.patientAppointmentsBySpecialty = medicalHistory;
    })
    .then(() => {

      var today  = new Date();
      var line = 20;
      today.toLocaleDateString("es-ES")
      let PDF = new jsPDF('p', 'mm', 'a4');
      let pageHeight= (PDF.internal.pageSize.height)-10;

      PDF.addImage('../../../assets/common/logo.png', 'PNG', 150, 10,50,50, );
      PDF.text(`FECHA DE EMISION: ${today.toLocaleDateString("es-ES")}`, 10,line);
      (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
      PDF.text(`Historia clínica de ${this.patientMedicalHistory.patient}`, 10,line);
      (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
      PDF.text(`-Datos ultimo control:`,10,line);
      (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
      PDF.text(`* Altura: ${this.patientMedicalHistory.height} cm`,15,line);
      (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
      PDF.text(`* Peso: ${this.patientMedicalHistory.weight} kgs`,15,line);
      (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
      PDF.text(`* Temperatura: ${this.patientMedicalHistory.temp} ºC`,15,line);
      (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
      PDF.text(`* Presión: ${this.patientMedicalHistory.pressure} (media)`,15,line);
      (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
      PDF.text(`- Historial de Atencion Especialidad: ${specialtyFormated}`,10,line);      
      (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
      this.patientAppointmentsBySpecialty.forEach(element => {
        PDF.text(`-----------------------------------------------------`,15,line);
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
        PDF.text(`* Fecha: ${element.date}`,15,line);
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
        PDF.text(`* Especialista: ${element.doctor}`,15,line);
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
        PDF.text(`* Diagnostico: ${element.diagnosis}`,15,line);
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
        PDF.text(`* Observaciones:`,15,line);
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
        for (var key in element.observations) {
          PDF.text(`* ${key}: ${element.observations[key]}`,20,line);
          (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
        }
        PDF.text(`* Comentario de ${element.appointmentInfo}`,15,line, {maxWidth: 180 });
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
      }); 

      PDF.save('historia-clínica'+ '-' + this.patientMedicalHistory.patient + '-' + specialtyFormated +'.pdf');
    });
  }

}
