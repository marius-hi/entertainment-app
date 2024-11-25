import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private routerSubscription:Subscription = new Subscription();
  private title:string = 'entertainment-app';
  public isWizard?:boolean;

  constructor(
    public router: Router
  ) {}

  public ngOnInit():void {
    this.routerSubscription = this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.isWizard = event?.url === '/wizard';
        }
      });
  }

  public ngOnDestroy():void {
    this.routerSubscription.unsubscribe();
  }
}
