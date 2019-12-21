import auth0 from 'auth0-js';

import { Injectable } from '@angular/core';
import { authConfig } from '../config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user-service';
import { User } from '../veriguide-model/rest-api-response/User';
import { Router } from '@angular/router';
import { URL_PATH_CONFIG, verimarkerInjectors } from '../common-type/verimarker-injectors';

import { NgxSpinnerService } from 'ngx-spinner';
import { apiEndpoint } from '../config';
import { AuthenticationStateEnum } from '../veriguide-model/loggedInUser';

@Injectable({
  providedIn: 'root'
})
export class Auth0Service {

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
  }

  login() {
    this.auth0.authorize();
  }

  logout() {
    this.userService.deleteLoggedInUserCookie();
    this.auth0.logout({
      return_to: verimarkerInjectors.get(URL_PATH_CONFIG).userLoginPage.fullPath
    });
  }

  handleAuthentication() {
    return this.auth0.parseHash( async (err, authResult) => {
      if ( authResult && authResult.accessToken && authResult.idToken ) {
        console.log('Access token: ', authResult.accessToken );
        console.log('id token: ', authResult.idToken );
        try {
          this.spinner.show();
          const headers = new HttpHeaders({
            'Content-Type':  'application/json',
            Authorization: `Bearer ${authResult.idToken}`
          });

          const user = await this.http.get<User>(`${apiEndpoint}/user`, { headers }).toPromise();
          this.spinner.hide();

          console.log(user);
          // user is registered in the system, fetch the user details
          // and store the user in the cookie as our session cookie
          if ( user.userId != null ) {
            this.userService.setLoggedInUser({
              authenticationState: AuthenticationStateEnum.Authenticated,
              userName: user.userName,
              email: user.email,
              userType: user.userType,
              accessToken: authResult.accessToken,
              idToken: authResult.idToken,
              userId: user.userId
            });

            // navigate to the user main page
            this.router.navigate( [ verimarkerInjectors.get(URL_PATH_CONFIG).userMainPage.fullPath ] );
          } else {
            // navgiate to register new user
            this.userService.setRegisterNewUser({
              authenticationState: AuthenticationStateEnum.NeedToCreate,
              idToken: authResult.idToken,
              accessToken: authResult.accessToken,
              userId: null,
              userType: '',
              email: '',
              userName: ''
            });

            let url = verimarkerInjectors.get(URL_PATH_CONFIG).userRegistrationPage.fullPath;
            url = url.replace(':userId', '0');
            this.router.navigate( [ url ] );
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
