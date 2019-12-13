import { Injectable } from '@angular/core';
import { Auth0Service } from './auth0.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoggedInUser } from '../veriguide-model/models';
import { Observable } from 'rxjs';
import { UrlPathConfig } from '../veriguide-common-type/url-path-config';
import { URL_PATH_CONFIG, veriguideInjectors } from '../veriguide-common-type/veriguide-injectors';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../veriguide-rest-service/login-service';

@Injectable({
  providedIn: 'root'
})
export class Auth0ResolverService {

  private urlPathConfig: UrlPathConfig;

  constructor( private router: Router,
               private authService: Auth0Service ) {
    this.urlPathConfig = veriguideInjectors.get(URL_PATH_CONFIG);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): LoggedInUser |
    Observable<LoggedInUser> | Promise<LoggedInUser> {

    /*
    const jwtCredentialStr = this.cookieService.get( this.userLoginConfig.loginSPCookieName_cookie );

    if  ( !jwtCredentialStr || jwtCredentialStr.length === 0 ) {
      this.router.navigate( [ this.urlPathConfig.schoolSelectLogin ] );
      return { authenticationState: AuthenticationStateEnum.NeedToLogin };
    }
    this.loginService.doLoginJwt( jwtCredentialStr ).subscribe( loggedInUser => {
      this.loggedInUserObservable.next( loggedInUser );
      this.router.navigate( [ this.urlPathConfig.userMainPage ] );
    });
    return this.loggedInUserObservable;
    */
    this.authService.handleAuthentication();
    return null;
  }

}
