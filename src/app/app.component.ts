import { Component } from '@angular/core';
import { Router, NavigationStart, Event, NavigationEnd, RouterEvent } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
