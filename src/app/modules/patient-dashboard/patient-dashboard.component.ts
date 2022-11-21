import { trigger, transition, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { rotateCubeToLeft } from 'ngx-router-animations';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css'],
  animations: [
    trigger('patient', [
      transition('* => patient', useAnimation(rotateCubeToLeft))
    ]),
    trigger('request-appointment-patient', [
      transition('* => request-appointment-patient', useAnimation(rotateCubeToLeft))
    ])

  ]
})
export class PatientDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  getState(outlet)  {
		return outlet.activatedRouteData.state;
	}

}
