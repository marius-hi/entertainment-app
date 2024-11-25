import { Observable, of } from 'rxjs';
import { APP_NAME } from './app.config';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';
import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import { TopRatedMediaComponent } from './modules/media/top-rated-media/top-rated-media.component';
import { TopRatedOverviewComponent } from './modules/media/top-rated-media/overview/top-rated-overview.component';
import { TopRatedDetailComponent } from './modules/media/top-rated-media/detail/top-rated-detail.component';

export enum MediaType {
  MOVIE = 'movie',
  TV_SHOW = 'tv-show'
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
  {
    path: 'movie',
    component: TopRatedMediaComponent,
    title: pageTitleResolver,
    children: [
      {
        path: 'top-rated',
        component: TopRatedOverviewComponent,
        data: {
          title: 'Top Rated Movies',
          mediaType: MediaType.MOVIE
        },
        title: pageTitleResolver
      },
      {
        path: 'detail/:id',
        component: TopRatedDetailComponent,
        data: {
          title: 'Movie Details',
          mediaType: MediaType.MOVIE
        },
        title: pageTitleResolver
      }
    ]
  },
  {
    path: 'tv-show',
    component: TopRatedMediaComponent,
    title: pageTitleResolver,
    children: [
      {
        path: 'top-rated',
        component: TopRatedOverviewComponent,
        data: {
          title: 'Top Rated TV Shows',
          mediaType: MediaType.TV_SHOW
        },
        title: pageTitleResolver
      },
      {
        path: 'detail/:id',
        component: TopRatedDetailComponent,
        data: {
          title: 'TV Show Details',
          mediaType: MediaType.TV_SHOW
        },
        title: pageTitleResolver
      }
    ]
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
