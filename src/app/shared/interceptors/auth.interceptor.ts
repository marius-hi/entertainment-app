import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TMDB_API_HOST } from '../../app.config';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService:AuthService
  ) {
  }

  intercept(httpRequest:HttpRequest<any>, next:HttpHandler):Observable<HttpEvent<any>> {
    const hasAuthorisationToken:boolean = httpRequest.headers.has('Authorization');
    const isTMDBUrl:boolean = httpRequest.url.startsWith(TMDB_API_HOST);
    const token:string | null = this.authService.token; // Replace this with your dynamic token retrieval logic

    // add an Authorization Bearer to all 'The Movie DB' requests, except for those where an Authorization Bearer is explicitly provided in the HTTP request options (e.g. validateToken())
    if (!hasAuthorisationToken && isTMDBUrl && token) {
      const clonedReq = httpRequest.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next.handle(clonedReq);
    }

    return next.handle(httpRequest);
  }
}