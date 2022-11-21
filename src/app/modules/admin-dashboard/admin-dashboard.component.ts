import { trigger, transition, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { rotateCubeToRight } from 'ngx-router-animations';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  animations: [
    trigger('admin', [
      transition('* => admin', useAnimation(rotateCubeToRight))
    ]),
    trigger('register-admin', [
      transition('* => register-admin', useAnimation(rotateCubeToRight))
    ]),
    trigger('request-appointment-admin', [
      transition('* => request-appointment-admin', useAnimation(rotateCubeToRight))
    ]),
    trigger('appointments', [
      transition('* => appointments', useAnimation(rotateCubeToRight))
    ]),
    trigger('users', [
      transition('* => users', useAnimation(rotateCubeToRight))
    ]),
    trigger('reports', [
      transition('* => reports', useAnimation(rotateCubeToRight))
    ]),
  ]
})
export class AdminDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  getState(outlet)  {
		return outlet.activatedRouteData.state;
	}

}
