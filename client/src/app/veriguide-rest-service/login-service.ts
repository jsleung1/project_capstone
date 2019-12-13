import { LoggedInUser, AuthenticationStateEnum } from '../veriguide-model/models';
import { UserService } from './../veriguide-user-service/user-service';
import { Observable, Subject } from 'rxjs';
import { VeriguideHttpClient } from './veriguide-http-client';
import { LoginCredentials } from 'src/app/veriguide-model/models';
import { Injectable } from '@angular/core';
import { CUHK_LOGIN_CONFIG, veriguideInjectors, URL_PATH_CONFIG } from '../veriguide-common-type/veriguide-injectors';
import { UserLoginConfig } from '../veriguide-common-type/user-login-config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loggedInUserObservable = new Subject<LoggedInUser>();
  private userLoginConfig: UserLoginConfig;

  private loggedInUser: LoggedInUser = { authenticationState: AuthenticationStateEnum.NeedToLogin };

  constructor( private http: VeriguideHttpClient,
               private userService: UserService,
               private router: Router )  {
    this.userLoginConfig =  veriguideInjectors.get(CUHK_LOGIN_CONFIG);
  }

  doLoginJson(credentials: LoginCredentials): Observable<LoggedInUser> {

    const credentialsToAuth = {
      loginId: credentials.loginId,
      loginType: credentials.loginType,
      password: credentials.password,
      schoolType: credentials.schoolType,
      jwtCredential: ''
    };

    credentialsToAuth.password = btoa( credentials.password );
    console.log(JSON.stringify( credentialsToAuth ));

    this.http.post<LoggedInUser>('login/veriguide', credentialsToAuth ).subscribe( loggedInUser => {
      this.loggedInUser = loggedInUser;
      this.userService.setLoggedInUser(  loggedInUser );
      this.loggedInUserObservable.next( loggedInUser );
    });

    return this.loggedInUserObservable;
  }

  doLoginJwt(jwt: string): Observable<LoggedInUser> {

    const credentialsToAuth = {
      loginId: '',
      password: '',
      loginType: { id: null, name: null},
      schoolType: { id: null, name: null},
      jwtCredential: jwt
    };
    console.log(JSON.stringify( credentialsToAuth ));

    this.http.post<LoggedInUser>('login/saml', credentialsToAuth ).subscribe( loggedInUser => {
      console.log( JSON.stringify(loggedInUser) );

      if ( loggedInUser.authenticationState === AuthenticationStateEnum.Authenticated ) {
        this.loggedInUser = loggedInUser;
        this.userService.setLoggedInUser(  loggedInUser );
        this.loggedInUserObservable.next( loggedInUser );
      } else {
        window.location.href = this.userLoginConfig.logoutSPurl;
      }
    });

    return this.loggedInUserObservable;
  }

  doLogout() {

  }
}
