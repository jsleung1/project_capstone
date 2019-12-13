import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoggedInUser, AuthenticationStateEnum } from '../veriguide-model/models';
import { CUHK_LOGIN_CONFIG, veriguideInjectors } from '../veriguide-common-type/veriguide-injectors';
import { UserLoginConfig } from '../veriguide-common-type/user-login-config';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly cookieName = 'veriguide-v2-7bf996f9-35ab-4a1b-a5af-3593a333b552';

    private loggedInUserObservable = new BehaviorSubject<LoggedInUser>({
        authenticationState: AuthenticationStateEnum.NeedToLogin,
        idToken: ''
    } );

    constructor( private cookieService: CookieService ) {
    }

    getLoggedInUser(): BehaviorSubject<LoggedInUser> {

        const userCookie = this.cookieService.get( this.cookieName );
        let alreadyLoggedInUser: LoggedInUser = null;

        if ( userCookie &&  userCookie.length > 0 ) {
            alreadyLoggedInUser = JSON.parse(userCookie);
            this.loggedInUserObservable.next( alreadyLoggedInUser );
        }
        return this.loggedInUserObservable;
    }

    setLoggedInUser(loggedInUser: LoggedInUser ) {

        //cookie duration same as the Auth0 JWT duration
        this.cookieService.set( this.cookieName,
                                JSON.stringify(loggedInUser),
                                new Date( new Date().getTime() + 36000 * 1000 ),
                                '/' );

        const alreadyLoggedInUserStr = this.cookieService.get( this.cookieName );
        console.log('alreadyLoggedInUserStr=' + alreadyLoggedInUserStr);

        this.loggedInUserObservable.next( loggedInUser );
    }

    deleteLoggedInUserCookie() {
        this.cookieService.delete( this.cookieName, "/" );
    }
}
