import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { CUHK_LOGIN_CONFIG, veriguideInjectors } from '../../veriguide-common-type/veriguide-injectors';
import { UserLoginConfig } from '../../veriguide-common-type/user-login-config';

@Injectable({
  providedIn: 'root'
})
export class VeriguideSpSamlGuard implements CanLoad {

  private userLoginConfig: UserLoginConfig;
  constructor( private cookieService: CookieService ) {
    this.userLoginConfig =  veriguideInjectors.get(CUHK_LOGIN_CONFIG);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

    const jwtCredentialStr = this.cookieService.get( this.userLoginConfig.loginCookieName_cookie_1 );
    return ( jwtCredentialStr && jwtCredentialStr.length > 0 );
  }
}
