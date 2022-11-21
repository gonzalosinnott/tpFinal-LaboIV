import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-request-appointment-specialty',
  templateUrl: './request-appointment-specialty.component.html',
  styleUrls: ['./request-appointment-specialty.component.css']
})
export class RequestAppointmentSpecialtyComponent implements OnInit {

  specialtiesList: any;
  @Output() selectedSpecialtyEvent = new EventEmitter<string>();


  constructor(private toastr: ToastrService,
              private spinnerService: SpinnerService,
              public auth: AuthService,
              public firestore: FirestoreService,
              public storage: StorageService) { }

  ngOnInit(): void {
    this.getSpecialties();
  }

  getSpecialties() {
    this.spinnerService.show();
    this.firestore.getSpecialties().then((data:any) => {
      this.specialtiesList = data[0].specialties;
      this.spinnerService.hide();
    });
  }

  selectSpecialty(e: any) {
    this.selectedSpecialtyEvent.emit(e.target.value);
  }
}
