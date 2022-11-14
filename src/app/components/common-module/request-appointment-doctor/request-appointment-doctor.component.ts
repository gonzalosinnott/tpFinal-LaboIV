import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-request-appointment-doctor',
  templateUrl: './request-appointment-doctor.component.html',
  styleUrls: ['./request-appointment-doctor.component.css']
})
export class RequestAppointmentDoctorComponent implements OnInit {

  doctors: any;
  @Input() specialty = '';
  @Output() selectedDoctorEvent = new EventEmitter<string>();

  constructor(private toastr: ToastrService,
              private spinnerService: SpinnerService,
              public auth: AuthService,
              public firestore: FirestoreService,
              public storage: StorageService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.specialty = changes['specialty'].currentValue;
    this.spinnerService.show();
    this.firestore.getDoctorsBySpecialtyAndEnabled(this.specialty).then((data) => {
      this.doctors = data;
      this.spinnerService.hide();
    });    
  }  

  selectDoctor(e: any) {
    this.selectedDoctorEvent.emit(e.target.value);
  }
}
