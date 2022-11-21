import { trigger, transition, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { rotateCubeToBottom } from 'ngx-router-animations';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css'],
  animations: [
    trigger('doctor', [
      transition('* => doctor', useAnimation(rotateCubeToBottom))
    ]),

    trigger('patients', [
      transition('* => patients', useAnimation(rotateCubeToBottom))
    ]),

  ]
})
export class DoctorDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  getState(outlet)  {
		return outlet.activatedRouteData.state;
	}

}
