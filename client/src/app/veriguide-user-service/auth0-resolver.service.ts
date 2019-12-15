import { Injectable } from '@angular/core';
import { Auth0Service } from './auth0.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth0ResolverService {

  constructor( private authService: Auth0Service ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.authService.handleAuthentication();
  }

}
