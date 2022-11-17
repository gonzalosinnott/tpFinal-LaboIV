import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'serviceHours'
})
export class ServiceHoursPipe implements PipeTransform {

  transform(value: any): unknown {

    var dayArr = value.split('-');
    var day;
    var start = dayArr[1];
    var end = dayArr[2];

    if(dayArr[0] == "monday") {
      day = "Lunes";
    }

    if(dayArr[0] == "tuesday") {
      day = "Martes";
    }

    if(dayArr[0] == "wednesday") {
      day = "Miercoles";
    }

    if(dayArr[0] == "thursday") {
      day = "Jueves";
    }

    if(dayArr[0] == "friday") {
      day = "Viernes";
    }

    if(dayArr[0] == "saturday") {
      day = "Sabado";
    }

    if(dayArr[0] == "sunday") {
      day = "Domingo";
    }

    return day + " de " + start + " a " + end;
  }

}
