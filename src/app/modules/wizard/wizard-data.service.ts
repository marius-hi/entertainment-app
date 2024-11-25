import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TMDB_API_HOST } from '../../app.config';

export interface IValidateTokenResponse {
  success:boolean;
  status_message:string;
  status_code:number;
}

export interface IValidateTokenErrorResponse {
  error:IValidateTokenResponse;
}

@Injectable()
export class WizardDataService {
  constructor(
    private http:HttpClient
  ) {}

  public validateToken(token:string): Observable<IValidateTokenResponse> {
    const url:string = `${TMDB_API_HOST}/authentication`;

    const headers:HttpHeaders = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<IValidateTokenResponse>(url, { headers });
  }
}
