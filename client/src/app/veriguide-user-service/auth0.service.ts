import auth0 from 'auth0-js';

import { Injectable } from '@angular/core';
import { authConfig } from '../config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user-service';
import { User } from '../veriguide-model/rest-api-types/User';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../veriguide-rest-service/login-service';
import { UrlPathConfig } from '../veriguide-common-type/url-path-config';
import { URL_PATH_CONFIG, veriguideInjectors } from '../veriguide-common-type/veriguide-injectors';
import { AuthenticationStateEnum } from '../veriguide-model/models';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable({
  providedIn: 'root'
})
export class Auth0Service {

  private urlPathConfig: UrlPathConfig;
  
  auth0 = new auth0.WebAuth({
    domain: authConfig.domain,
    clientID: authConfig.clientId,
    redirectUri: authConfig.callbackUrl,
    responseType: 'token id_token',
    scope: 'openid'
  });

  constructor( private http: HttpClient,
               private userService: UserService,
               private router: Router,
               private spinner: NgxSpinnerService ) {
    this.urlPathConfig = veriguideInjectors.get(URL_PATH_CONFIG);
  }

  login() {
    this.auth0.authorize();
  }

  logout() {
    this.userService.deleteLoggedInUserCookie();
    this.auth0.logout({
      return_to: this.urlPathConfig.userLoginPage.fullPath
    });
  }

  handleAuthentication() {
    return this.auth0.parseHash( async (err, authResult) => {
      if ( authResult && authResult.accessToken && authResult.idToken ) {
        console.log('Access token: ', authResult.accessToken );
        console.log('id token: ', authResult.idToken );       
        try {
          this.spinner.show();
          
          const user = await this.http.get<User>('user',
          {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              Authorization: `Bearer ${authResult.idToken}`
            })
          }).toPromise();
          this.spinner.hide();

          console.log(user);
          // user is registered in the system, fetch the user details 
          // and store the user in the cookie as our session cookie
          if ( user.userId != null ) {
            this.userService.setLoggedInUser({
              authenticationState: AuthenticationStateEnum.Authenticated,
              userName: user.userName,
              email: user.email,
              userType: user.userType.charAt(0).toUpperCase() + user.userType.slice(1),
              accessToken: authResult.accessToken,
              idToken: authResult.idToken
            });

            // navigate to the user main page
            this.router.navigate( [ this.urlPathConfig.userMainPage.fullPath ] );
          } else {
            // navgiate to register new user
          }

        } catch (e) {
          console.error(e);
        }
      } else if (err) {
        console.error(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }
}
