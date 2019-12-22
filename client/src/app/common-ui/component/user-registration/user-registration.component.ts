import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../../veriguide-user-service/user-service';
import { User, Instructor, Student } from '../../../model/rest-api-response/User';
import { UtilService } from '../../../veriguide-user-service/util.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CreateUserRequest } from '../../../model/rest-api-request/user/CreateUserRequest';
import { UpdateUserRequest } from '../../../model/rest-api-request/user/UpdateUserRequest';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { URL_PATH_CONFIG, verimarkerInjectors } from '../../../common-type/verimarker-injectors';
import { AlertDialogService } from '../../dialog/alert-dialog/alert-dialog-service';
import { Subscription } from 'rxjs';
import { VerimarkerHttpClient } from 'src/app/veriguide-rest-service/verimarker-http-client';
import { apiEndpoint } from 'src/app/config';
import { LoggedInUser, AuthenticationStateEnum } from 'src/app/model/loggedInUser';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit, OnDestroy  {

  private subscription: Subscription;
  private registerUser: LoggedInUser;
  private title = '';
  private buttonTitle = '';
  private userTypes = [ Instructor, Student ];

  constructor(private userService: UserService,
              private http: HttpClient,
              private veriguideHttpClient: VerimarkerHttpClient,
              private activatedRoute: ActivatedRoute,
              private route: ActivatedRoute,
              private router: Router,
              private spinner: NgxSpinnerService,
              private alertDialogService: AlertDialogService ) { 

    this.userService.getRegisterNewUser().subscribe( registerUser => {
      const userId = this.route.snapshot.paramMap.get('userId');
      if ( userId === '0') {
        this.title = 'User Registration - Create new user';
        this.buttonTitle = 'Create new user';
        this.registerUser = registerUser;
      }
    });

    // if user already logged in and userId = 0 to create, we skip this user action and navigate back to user main page
    this.subscription = this.userService.getLoggedInUser().subscribe(loggedInUser => {
      const userId = this.route.snapshot.paramMap.get('userId');
      if ( loggedInUser.authenticationState === AuthenticationStateEnum.Authenticated && userId === '0') {
        this.router.navigate( [ verimarkerInjectors.get(URL_PATH_CONFIG).userMainPage.fullPath ] );
      }
      if ( loggedInUser.authenticationState === AuthenticationStateEnum.Authenticated && userId !== '0') {
        this.registerUser =  loggedInUser;
        this.title = 'User Settings - Update existing user';
        this.buttonTitle = 'Update user';
      }
    });
  }

  ngOnInit() {
  }

  isEnableUpdateUserButton() {
    return ! UtilService.isStringEmpty( this.registerUser.userName )
      && ! UtilService.isStringEmpty( this.registerUser.email )
      && ! UtilService.isStringEmpty( this.registerUser.userType )
  }

  async onCreateOrUpdateUser() {
    if (  this.buttonTitle === 'Create new user') {
      await this.createNewUser();
    }
    if ( this.isUpdateExistUser() ) {
      await this.updateExistingUser();
    }
  }

  async createNewUser() {
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
      const user = await this.http.post( `${apiEndpoint}/users`, createUserRequest, { headers } ).toPromise() as User;
      this.spinner.hide();

      // for create new user when login to auth0, set the newly created user as our logged in user and create the session cookie
      if ( this.registerUser.authenticationState === AuthenticationStateEnum.NeedToCreate ) {
        this.alertDialogService.openDialog({
          title: 'Register New User',
          message: 'Successfully registered as a new user.',
          dialogType: 'OKDialog'
        }).then( res => {
          this.userService.setLoggedInUser({
            authenticationState: AuthenticationStateEnum.Authenticated,
            userName: user.userName,
            email: user.email,
            userType: user.userType,
            accessToken: this.registerUser.accessToken,
            idToken: this.registerUser.idToken,
            userId: user.userId
          });
          // this.router.navigate( [ veriguideInjectors.get(URL_PATH_CONFIG).userMainPage.fullPath ] );
        });
      }
    } catch (e) {
      this.spinner.hide();
      console.log(e);
    }
  }

  async updateExistingUser() {
    const updateUserRequest: UpdateUserRequest = {
      userType: this.registerUser.userType,
      email: this.registerUser.email
    };

    this.spinner.show();
    try {
      const user = await this.veriguideHttpClient.patch( 'users', updateUserRequest ).toPromise() as User;
      this.spinner.hide();
      this.alertDialogService.openDialog({
        title: 'Update Existing User',
        message: 'Successfully updated the user settings.',
        dialogType: 'OKDialog'
      }).then( res => {
        // navigate to the user main page
        this.userService.setLoggedInUser({
          authenticationState: AuthenticationStateEnum.Authenticated,
          userName: user.userName,
          email: user.email,
          userType: user.userType,
          accessToken: this.registerUser.accessToken,
          idToken: this.registerUser.idToken,
          userId: user.userId
        });
        this.router.navigate( [ verimarkerInjectors.get(URL_PATH_CONFIG).userMainPage.fullPath ] );
      });

    } catch (e) {
      this.spinner.hide();
      console.log(e);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  isUpdateExistUser(): boolean {
    return this.buttonTitle === 'Update user';
  }
}
