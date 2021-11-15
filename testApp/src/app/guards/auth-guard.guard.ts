import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate{
  constructor(private authservice:AuthService){}

  canActivate(): boolean {
    return this.authservice.isAuthenticated();
  }
}
