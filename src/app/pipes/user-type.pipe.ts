import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userType'
})
export class UserTypePipe implements PipeTransform {

  transform(value: string): unknown {
   
    if(value == "Admin") {
      return "Administrador";
    }

    if(value == "Doctor") {
      return "Doctor";
    }

    if(value == "Patient") {
      return"Paciente";
    }

    return value;
  }

}
