import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { StorageService } from 'src/app/services/storage.service';
import { SpecialtiesPipe } from 'src/app/pipes/specialties.pipe';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {

  appointmentsBySpecialist: any;
  patientsBySpecialist: any = [];
  patients: any;
  user: any;
  userData: any;
  patientMedicalHistory: any;
  patientAppointments: any;

  constructor(private toastr: ToastrService,
              private spinnerService: SpinnerService,
              public auth: AuthService,
              public firestore: FirestoreService,
              public storage: StorageService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userData'));
    this.getUserData();

  }

  getUserData() {
    this.firestore.getUserData(this.user.uid)
    .then((user: any) => {      
      this.userData = user;
    })
    .then(() => {
      this.getPatients();
    });
  }

  getPatients() {
    this.patientsBySpecialist = [];
    this.appointmentsBySpecialist = '';
    this.patients = '';
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
          patient.appointmentDates = [];
          this.appointmentsBySpecialist.forEach((appointment: any) => {
            if (patient.displayName == appointment.patient) {
              this.patientsBySpecialist.push(patient);
              patient.appointmentDates.push(appointment.date);
            }
          });
        });
      })
      .then(() => {
        this.patientsBySpecialist = this.removeDuplicates(this.patientsBySpecialist)
      })
      .then(() => {
        console.log(this.patients);
        console.log(this.patientsBySpecialist);  
      })
    })
    .finally(() => {
      console.log(this.patientsBySpecialist);
      this.spinnerService.hide();
    });
  }

  removeDuplicates(arr: any) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
  }

  download(patient){
    this.firestore
    .getMedicalHistoryByPatient(      
      patient
    )
    .then((data) => {
      this.patientMedicalHistory = data[0]; 
      console.log(this.patientMedicalHistory);        
    })
    .then(() => {
      this.firestore
      .getMedicalHistoryBySpecialistAndPatient(
        this.userData.displayName,      
        patient
      )
      .then((data) => {
        this.patientAppointments = data; 
      })
      .then(() => {


      
      var today  = new Date();
      var line = 20;
      today.toLocaleDateString("es-ES")
      let PDF = new jsPDF('p', 'mm', 'a4');
      let pageHeight= (PDF.internal.pageSize.height)-10;
      
      PDF.addImage('../../../assets/common/logo.png', 'PNG', 150, 10,50,50);
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
      PDF.text(`- Historial de Atencion con el especialista: ${this.patientAppointments[0].doctor}`,10,line);
      (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
      this.patientAppointments.forEach(element => {
        let specialtyFormated = new SpecialtiesPipe().transform(element.specialty);
        PDF.text(`-----------------------------------------------------`,15,line);
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
        PDF.text(`* Fecha: ${element.date}`,15,line);
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
        PDF.text(`* Especialidad: ${specialtyFormated}`,15,line);
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
        PDF.text(`* Diagnostico: ${element.diagnosis}`,15,line);
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
        PDF.text(`* Observaciones:`,15,line);
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
        for (var key in element.observations) {
          PDF.text(`* ${key}: ${element.observations[key]}`,20,line);
          (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
        }
        PDF.text(`* Comentario de ${element.appointmentInfo}`,15,line, {maxWidth: 160 });
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
      });             
         
      PDF.save('historia-clínica'+ '-' + this.patientMedicalHistory.patient + '.pdf');      
      })
    })
  }   

}
