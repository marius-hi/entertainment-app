import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

const TMDB_KEY_STORAGE = 'tmdb_token';

@Injectable()
export class AuthService {
  private _token:string|null = null;

  constructor(
    private localStorage:LocalStorageService
  ) {}

  public set token(token:string) {
    this._token = token;
    this.localStorage.set(TMDB_KEY_STORAGE, token);
  }

  public get token():string|null {
    this._token = this._token || this.localStorage.get(TMDB_KEY_STORAGE);
    return this._token;
  }

  public get hasValidToken():boolean {
    this._token = this.localStorage.get(TMDB_KEY_STORAGE);
    return this._token !== null;
  }
}
