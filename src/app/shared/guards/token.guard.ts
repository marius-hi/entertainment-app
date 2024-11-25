import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenGuard implements CanActivate {
  constructor(
    private router:Router,
    private authService:AuthService
  ) {}

  public canActivate():boolean {
    if (this.authService.hasValidToken) {
      return true;
    } else {
      this.router.navigate([ '/wizard' ]);
      return false;
    }
  }
}
