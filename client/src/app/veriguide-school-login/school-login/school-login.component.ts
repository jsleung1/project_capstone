import { Auth0Service } from '../../veriguide-user-service/auth0.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoginService } from '../../veriguide-rest-service/login-service';
import { UrlPathConfig } from '../../veriguide-common-type/url-path-config';
import { CUHK_LOGIN_CONFIG, URL_PATH_CONFIG, veriguideInjectors } from '../../veriguide-common-type/veriguide-injectors';
import { LoginCredentials, SystemParam, AuthenticationStateEnum } from '../../veriguide-model/models';
import { UserLoginConfig } from '../../veriguide-common-type/user-login-config';

@Component({
  selector: 'app-school-login',
  templateUrl: './school-login.component.html',
  styleUrls: ['./school-login.component.css']
})
export class SchoolLoginComponent implements OnInit {

  private credentials: LoginCredentials = {};
  private loginFailed = false;
  private urlPathConfig: UrlPathConfig;

  private loginTypes: SystemParam[] = new Array();
  private schoolTypes: SystemParam[] = new Array();

  private userLoginConfig: UserLoginConfig;

  constructor( private loginService: LoginService,
               private authService: Auth0Service,
               private route: ActivatedRoute,
               private router: Router ) {

      this.urlPathConfig = veriguideInjectors.get(URL_PATH_CONFIG);
      this.userLoginConfig =  veriguideInjectors.get(CUHK_LOGIN_CONFIG);

      this.loginTypes.push( { id: 1, name: 'login.panel.loginType.computingId' } );
      this.loginTypes.push( { id: 2, name: 'login.panel.loginType.universityId' } );
      this.loginTypes.push( { id: 3, name: 'login.panel.loginType.email' } );

      this.schoolTypes.push( { id: 1, name: 'login.panel.school.cuhk' } );
      this.schoolTypes.push( { id: 2, name: 'login.panel.school.hksyu' } );
      this.schoolTypes.push( { id: 3, name: 'login.panel.school.hsuhk' } );
      this.schoolTypes.push( { id: 4, name: 'login.panel.school.cuscs' } );
      this.schoolTypes.push( { id: 5, name: 'login.panel.school.polyu' } );
      this.schoolTypes.push( { id: 6, name: 'login.panel.school.polyu.cpce' } );
      this.schoolTypes.push( { id: 7, name: 'login.panel.school.others' } );

      this.credentials.loginType =  this.loginTypes[0];
      this.credentials.schoolType = this.schoolTypes[0];
  }

  ngOnInit() {
  }

  login() {
    this.loginService.doLoginJson(this.credentials).subscribe( loggedInUser => {

      if ( loggedInUser.authenticationState === AuthenticationStateEnum.Authenticated ) {
        this.loginFailed = false;
        // go to main page of the user
        this.router.navigate([ this.urlPathConfig.userMainPage ]);
        // this.router.navigateByUrl('');
      } else {
        // display error message
        this.loginFailed = true;
        console.log('remain in the logged in page and display login error');
      }
    });

    return false;
  }

  auth0Login() {
    this.authService.login();
  }

  onChange($event) {

  }
}
