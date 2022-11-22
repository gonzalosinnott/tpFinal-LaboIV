import { Component, OnInit } from '@angular/core';
import { PieChart } from 'chartist';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { StorageService } from 'src/app/services/storage.service';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-appointments-ended',
  templateUrl: './appointments-ended.component.html',
  styleUrls: ['./appointments-ended.component.css']
})
export class AppointmentsEndedComponent implements OnInit {

  appointments: any = [];
  doctors: any = [];

  data = {
    labels: [],
    series: []
  };

  options = {
    donut: true,
    donutWidth: 50,
    startAngle: 270,
    showLabel: true
  }

  constructor(public auth: AuthService,
              public firestore: FirestoreService,
              public storage: StorageService,) { }

  ngOnInit(): void {
    this.firestore.getFinishedAppointments().subscribe((appointments: any) => {
      this.appointments = appointments;
      this.appointments.forEach((appointment: any) => {
        this.doctors.push(appointment.doctor);        
      });
      const result =  this.doctors.reduce((json,val)=>({...json, [val]:(json[val] | 0) + 1}),{});
      console.log(result);
      console.log(Object.keys(result));
      console.log(Object.values(result));
      this.data.labels = Object.keys(result);
      this.data.series = Object.values(result);
    });
    new PieChart('#chart3', this.data, this.options);
  }

  downloadData() {
    var imgData;
    html2canvas(document.getElementById('chart3')).then(function(canvas) {
      imgData = canvas.toDataURL('image/png');
      var doc = new jsPDF();
      doc.text(`CANTIDAD DE TURNOS FINALIZADOS POR ESPECIALISTA`, 10,10);
      doc.addImage(imgData, 'PNG', 10, 20, 100, 100);
      doc.save('appointments-ended.pdf');
    });
  }

}
