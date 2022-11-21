import { trigger, transition, useAnimation } from '@angular/animations';
import { Component } from '@angular/core';
import { Router, NavigationStart, Event, NavigationEnd, RouterEvent } from '@angular/router';
import { rotateCubeToTop } from 'ngx-router-animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [    
    trigger('admin', [
      transition('* => admin', useAnimation(rotateCubeToTop))
    ]),

    trigger('doctor', [
      transition('* => doctor', useAnimation(rotateCubeToTop))
    ]),

    trigger('patient', [
      transition('* => patient', useAnimation(rotateCubeToTop))
    ]),

    trigger('not-found', [
      transition('* => not-found', useAnimation(rotateCubeToTop))
    ]),

    trigger('verification', [
      transition('* => verification', useAnimation(rotateCubeToTop))
    ]),
  ]
})

export class AppComponent {
  
  title = 'clinica';
  timeout;
  
  loader = true;
  constructor(private router: Router) {
    router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    });
  }

  getState(outlet)  {
		return outlet.activatedRouteData.state;
	}

  navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this.loader = true;
    }
    if (event instanceof NavigationEnd) {
      // Hide loading indicator
      this.timeout = setTimeout(() => {
        clearTimeout(this.timeout);
        this.loader = false;
      }, 1000);
    }
  }
}
