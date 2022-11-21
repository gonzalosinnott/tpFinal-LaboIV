import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import * as XLSX from 'xlsx/xlsx.mjs';
import jsPDF from 'jspdf';
import { SpecialtiesPipe } from 'src/app/pipes/specialties.pipe';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  usersData: any[] = [];

  constructor(private firestoreService: FirestoreService,
              private spinnerService: SpinnerService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getUsersData();
  }

  getUsersData() {
    this.spinnerService.show();
    this.firestoreService.getAllUsers().subscribe((users: any) => {
      this.usersData = users;
      this.spinnerService.hide();
    });
  }

  disableUser(uid: any) {
    this.spinnerService.show();
    this.firestoreService.disableUser(uid).then(() => {
      this.getUsersData();
      this.spinnerService.hide();
      this.toastr.success('Usuario deshabilitado correctamente');
    });
  }  

  enableUser(uid: any) {
    this.spinnerService.show();
    this.firestoreService.enableUser(uid).then(() => {
      this.getUsersData();
      this.spinnerService.hide();
      this.toastr.success('Usuario habilitado correctamente');
    });
  }

  downloadAppointments(user: any, role: any) {
    console.log(user);
    console.log(role);
    if(role == 'Doctor') {
      this.firestoreService.getAppointmentsBySpecialist(user)
      .then((data: any) => {
        console.log(data);
        this.generatePDF(data, user, role);
      });
    }

    if(role == 'Patient') {
      this.firestoreService.getAppointmentsByPatient(user)
      .then((data: any) => {
        console.log(data);
        this.generatePDF(data, user, role);
      });
    }
  }

  generatePDF(data: any, name: any, role: any) {

    if(role == 'Doctor') {
      var today  = new Date();
      var line = 20;
      today.toLocaleDateString("es-ES")
      let PDF = new jsPDF('p', 'mm', 'a4');
      let pageHeight= (PDF.internal.pageSize.height)-10;

      PDF.text(`HISTORIAL DE CONSULTAS DEL ESPECIALISTA ${name}`, 10,10);
      PDF.addImage('../../../assets/common/logo.png', 'PNG', 150, 20,50,50);
      PDF.text(`FECHA DE EMISION: ${today.toLocaleDateString("es-ES")}`, 10,line);
      (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
      data.forEach(element => {
        let specialtyFormated = new SpecialtiesPipe().transform(element.specialty);
        PDF.text(`-----------------------------------------------------`,15,line);
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
        PDF.text(`* Fecha: ${element.date}`,15,line);
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
        PDF.text(`* Especialidad: ${specialtyFormated}`,15,line);
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
        PDF.text(`* Paciente: ${element.patient}`,15,line);
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;       
      });
      PDF.save('historial-atenciones'+ '-' + name + '.pdf'); 
    }
    
    if(role == 'Patient') {
      var today  = new Date();
      var line = 20;
      today.toLocaleDateString("es-ES")
      let PDF = new jsPDF('p', 'mm', 'a4');
      let pageHeight= (PDF.internal.pageSize.height)-10;

      PDF.text(`HISTORIAL DE CONSULTAS DEL PACIENTE ${name}`, 10,10);
      PDF.addImage('../../../assets/common/logo.png', 'PNG', 150, 20,50,50);
      PDF.text(`FECHA DE EMISION: ${today.toLocaleDateString("es-ES")}`, 10,line);
      (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
      data.forEach(element => {
        let specialtyFormated = new SpecialtiesPipe().transform(element.specialty);
        PDF.text(`-----------------------------------------------------`,15,line);
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
        PDF.text(`* Fecha: ${element.date}`,15,line);
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
        PDF.text(`* Especialidad: ${specialtyFormated}`,15,line);
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;
        PDF.text(`* Especialista: ${element.doctor}`,15,line);
        (line > pageHeight) ? (PDF.addPage(), line = 20) : line += 10;       
      });
      PDF.save('historial-atenciones'+ '-' + name + '.pdf'); 
    }
  }


  downloadData() {
    // Acquire Data (reference to the HTML table)
    var table_elt = document.getElementById("users-table");

    // Extract Data (create a workbook object from the table)
    var workbook = XLSX.utils.table_to_book(table_elt);

    // Process Data (add a new row)
    var ws = workbook.Sheets["Sheet1"];
    XLSX.utils.sheet_add_aoa(ws, [["Created "+new Date().toISOString()]], {origin:-1});

    // Package and Release Data (`writeFile` tries to write and save an XLSB file)
    XLSX.writeFile(workbook, "reporte-usuarios.xlsx");
  }

}
