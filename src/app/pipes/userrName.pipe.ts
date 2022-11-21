import { Pipe, PipeTransform } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { SpinnerService } from '../services/spinner.service';

@Pipe({
  name: 'userName'
})
export class UserNamePipe implements PipeTransform {

  constructor(public authService: AuthService,
              private firestoreService: FirestoreService,
              private spinnerService: SpinnerService,
              private toastr: ToastrService,) { }

  transform(value: any) {
   
    var userName;
    
    this.firestoreService.getUserDisplayName(value).then((data) => {
      userName = data;
    })
    .then(() => {
      return userName;
    })    
    .catch((e) => {
      this.toastr.error(e.message);
    })
  }
}
