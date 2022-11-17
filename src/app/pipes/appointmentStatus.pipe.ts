import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appointmentStatus'
})
export class AppointmentStatusPipe implements PipeTransform {

  transform(value: any): unknown {
   
    var status = value;

    if(status == "pending") {
      status = "PENDIENTE";
    }

    if(status == "canceled") {
      status = "CANCELADO";
    }

    if(status == "rejected") {
      status = "RECHAZADO";
    }

    if(status == "accepted") {
      status = "ACEPTADO";
    }

    if(status == "closed") {
      status = "FINALIZADO";
    }
    
    return status;
  }

}
