import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-request-appointment-patient',
  templateUrl: './request-appointment-patient.component.html',
  styleUrls: ['./request-appointment-patient.component.css']
})
export class RequestAppointmentPatientComponent implements OnInit {

  patients:any;
  @Output() selectedPatientEvent = new EventEmitter<string>();

  constructor(private toastr: ToastrService,
              private spinnerService: SpinnerService,
              public auth: AuthService,
              public firestore: FirestoreService,
              public storage: StorageService) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.firestore.getAllPatients().then((data) => {
      this.patients = data;
      this.spinnerService.hide();
    });
  }

  selectPatient(e: any) {
    this.selectedPatientEvent.emit(e.target.value);
  }
}
