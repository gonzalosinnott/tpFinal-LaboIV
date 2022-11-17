import { Pipe, PipeTransform } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { SpinnerService } from '../services/spinner.service';

@Pipe({
  name: 'userName'
})
export class UserNamePipe implements PipeTransform {

  userName: any;
  constructor(public authService: AuthService,
              private firestoreService: FirestoreService,
              private spinnerService: SpinnerService,
              private toastr: ToastrService,) { }

  transform(value: any) {
   
    var userUID = value;

    this.spinnerService.show();
    new Promise((resolve, reject) => {
      this.firestoreService.getUserDisplayName(userUID).then((data) => {
        resolve(data);
        console.log(data);
      });
    })
    .then((data) => {
      this.userName = data;
      return data;
    })
    .catch((e) => {
      this.toastr.error(e.message);
    })
    .finally(() => {
      this.spinnerService.hide();
      return this.userName;
    });
  }
}
