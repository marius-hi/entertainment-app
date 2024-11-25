import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { AuthService } from './shared/services/auth.service';
import { LocalStorageService } from './shared/services/local-storage.service';

export const APP_NAME:string = 'Entertainment App';
export const TMDB_API_HOST:string = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_PATH:string = 'https://image.tmdb.org/t/p/w220_and_h330_face';

export const appConfig:ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()), provideAnimationsAsync(),

    // register services for app bootstrap
    { provide: AuthService, useClass: AuthService },
    { provide: LocalStorageService, useClass: LocalStorageService },

    // register http interceptors
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
};
