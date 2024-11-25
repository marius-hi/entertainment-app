import { Observable, of } from 'rxjs';
import { APP_NAME } from './app.config';
import { TokenGuard } from './shared/guards/token.guard';
import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import { TopRatedMediaComponent } from './modules/media/top-rated-media/top-rated-media.component';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';
import { WizardComponent } from './modules/wizard/wizard.component';
import { MediaItemDetailsComponent } from './modules/media/media-item-details/media-item-details.component';

export enum MediaType {
  MOVIE = 'movie',
  TV_SHOW = 'tv'
}

const pageTitleResolver:ResolveFn<string> = (route:ActivatedRouteSnapshot):Observable<string> => {
  const title:string = route.data[ 'title' ];
  return of(`${title? title + ' - ' : ''}${APP_NAME}`);
};

export const routes:Routes = [
  // no homepage, instead redirect to the tab: Top Rated TV Shows
  {
    path: '',
    redirectTo: '/tv-show/top-rated',
    pathMatch: 'full'
  },
  // the wizard is used to retrieve the token
  {
    path: 'wizard',
    component: WizardComponent,
    data: {
      title: 'Wizard'
    },
    title: pageTitleResolver
  },
  {
    path: 'movie/top-rated',
    component: TopRatedMediaComponent,
    data: {
      title: 'Top Rated Movies',
      mediaType: MediaType.MOVIE
    },
    title: pageTitleResolver,
    canActivate: [ TokenGuard ]
  },
  {
    path: 'movie/detail/:id',
    component: MediaItemDetailsComponent,
    data: {
      title: 'Movie Details',
      mediaType: MediaType.MOVIE
    },
    title: pageTitleResolver,
    canActivate: [ TokenGuard ]
  },
  {
    path: 'tv-show/top-rated',
    component: TopRatedMediaComponent,
    data: {
      title: 'Top Rated TV Shows',
      mediaType: MediaType.TV_SHOW
    },
    title: pageTitleResolver,
    canActivate: [ TokenGuard ]
  },
  {
    path: 'tv-show/detail/:id',
    component: MediaItemDetailsComponent,
    data: {
      title: 'TV Show Details',
      mediaType: MediaType.TV_SHOW
    },
    title: pageTitleResolver,
    canActivate: [ TokenGuard ]
  },

  {
    path: '**',
    component: PageNotFoundComponent,
    data: {
      title: 'Page not found (error 404)',
    },
    title: pageTitleResolver
  },
];
