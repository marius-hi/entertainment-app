import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderNavigationComponent } from './modules/layout/header-navigation/header-navigation.component';
import { SearchResultsComponent } from './modules/media/search-results/search-results.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    HeaderNavigationComponent,
    RouterOutlet,
    SearchResultsComponent
  ],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private routerSubscription:Subscription = new Subscription();
  public isWizard?:boolean;
  public searchQuery?:string;

  constructor(
    public router:Router
  ) {}

  public ngOnInit():void {
    this.routerSubscription = this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.isWizard = event?.url === '/wizard';
        }
      });
  }

  public setSearchQuery(searchQuery:string):void {
    if(searchQuery !== '') {
      this.searchQuery = searchQuery;
    } else {
      this.searchQuery = undefined;
    }
  }

  public ngOnDestroy():void {
    this.routerSubscription.unsubscribe();
  }
}
