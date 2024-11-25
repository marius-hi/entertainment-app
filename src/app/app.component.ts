import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationStart, Params, Route, Router, RouterOutlet } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderNavigationComponent } from './modules/layout/header-navigation/header-navigation.component';
import { SearchResultsComponent } from './modules/media/search-results/search-results.component';
import { MediaType } from './app.settings';

@Component({
  selector: 'app-root',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    HeaderNavigationComponent,
    RouterOutlet,
    SearchResultsComponent
  ],
  templateUrl: './app.component.html',
  standalone: true
})
export class AppComponent implements OnInit, OnDestroy {
  private routerSubscription:Subscription = new Subscription();
  public mediaType!:MediaType;
  public isWizard?:boolean;
  public searchTerm?:string;

  constructor(
    public activatedRoute:ActivatedRoute,
    public router:Router
  ) {}

  public ngOnInit():void {
    this.listen();
  }

  private listen():void {
    // get the search term from the query parameters
    this.activatedRoute.queryParams
      .pipe(
        map((params:Params) => params['search'])
      )
      .subscribe((searchTerm:string) => {
        this.searchTerm = searchTerm;
      });

    // fetch mediaType from the current activated route and determine if the current path is the wizard
    this.routerSubscription = this.router.events
      .pipe(
        filter((event) => event instanceof ActivationStart),
        map((event:ActivationStart) => event?.snapshot?.routeConfig)
      )
      .subscribe((routeConfig:Route|null|undefined) => {
        this.mediaType = routeConfig?.data?.['mediaType'];
        this.isWizard = routeConfig?.path === 'wizard';
      });
  }

  public ngOnDestroy():void {
    this.routerSubscription.unsubscribe();
  }
}
