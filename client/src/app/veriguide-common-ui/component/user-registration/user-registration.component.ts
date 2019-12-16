import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../veriguide-user-service/user-service';
import { User, Instructor, Student } from '../../../veriguide-model/rest-api-response/User';
import { UtilService } from '../../../veriguide-user-service/util.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CreateUserRequest } from '../../../veriguide-model/rest-api-request/user/CreateUserRequest';
import { LoggedInUser, AuthenticationStateEnum } from '../../../veriguide-model/models';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UrlPathConfig } from '../../../veriguide-common-type/url-path-config';
import { URL_PATH_CONFIG, veriguideInjectors } from '../../../veriguide-common-type/veriguide-injectors';
import { AlertDialogService } from '../../dialog/alert-dialog/alert-dialog-service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {

  private registerUser: LoggedInUser;
  private title = '';
  private buttonTitle = '';
  private userTypes = [ Instructor, Student ];

  constructor(private userService: UserService,
              private http: HttpClient,
              private router: Router,
              private spinner: NgxSpinnerService,
              private alertDialogService: AlertDialogService ) { 

    this.userService.getRegistrationUser().subscribe( registerUser => {
      this.registerUser = registerUser;
      if ( this.registerUser.userId == null) {
        this.title = 'User Registration - Create new user';
        this.buttonTitle = 'Create new user';
      } else {
        this.title = 'User Registration - Update existing user';
        this.buttonTitle = 'Update user';
      }
    })

  }

  ngOnInit() {
  }

  isEnableUpdateUserButton() {
    return ! UtilService.isStringEmpty( this.registerUser.userName )
      && ! UtilService.isStringEmpty( this.registerUser.email )
      && ! UtilService.isStringEmpty( this.registerUser.userType )
  }

  async onCreateOrUpdateUser() {

    const createUserRequest: CreateUserRequest = {
      userType: this.registerUser.userType,
      email: this.registerUser.email,
      userName: this.registerUser.userName
    };

    const headers = new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: `Bearer ${ this.registerUser.idToken}`
    });

    this.spinner.show();
    try {
      const user = await this.http.post( 'users', createUserRequest, { headers } ).toPromise() as User;
      this.spinner.hide();

      // for create new user when login to auth0, set the newly created user as our logged in user and create the session cookie
      if ( this.registerUser.authenticationState === AuthenticationStateEnum.NeedToCreate ) {
        this.userService.setLoggedInUser({
          authenticationState: AuthenticationStateEnum.Authenticated,
          userName: user.userName,
          email: user.email,
          userType: user.userType,
          accessToken: this.registerUser.accessToken,
          idToken: this.registerUser.idToken
        });

        this.alertDialogService.openDialog({
          title: 'Register New User',
          message: 'Successfully created the new user.',
          dialogType: 'OKDialog'
        }).then( res => {
          // navigate to the user main page
          this.router.navigate( [ veriguideInjectors.get(URL_PATH_CONFIG).userMainPage.fullPath ] );
        });
      }
    } catch (e) {
      this.spinner.hide();
      console.log(e);
    }
  }
}
