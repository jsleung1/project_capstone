import { UserService } from 'src/app/veriguide-user-service/user-service';
import { AuthenticationStateEnum } from '../../veriguide-model/server-model/loggedInUser';
import { Injectable, OnDestroy } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree, Router, CanActivate, Route } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { LoggedInUser,  } from '../../veriguide-model/models';
import { veriguideInjectors, URL_PATH_CONFIG } from '../veriguide-injectors';

@Injectable({
  providedIn: 'root'
})
export class GotoUrlAuthGuard implements CanActivate, OnDestroy  {

  private subscription: Subscription;
  private loggedInUser: LoggedInUser = { authenticationState: AuthenticationStateEnum.NeedToLogin };

  private defaultAuthGuardOptions = {
    authConds: [ AuthenticationStateEnum.Authenticated ],
    authCondProceedOrigLink: true,
    authCondRedirectUrl: veriguideInjectors.get(URL_PATH_CONFIG).userLoginPage.fullPath
  };

  constructor( private router: Router,
               private userService: UserService ) {
    this.subscription = this.userService.getLoggedInUser().subscribe( loggedInUser => {
      this.loggedInUser = loggedInUser;
    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.processData( next.data );
  }

  private processData(data: any): boolean {

    let isAuthCondSatisfy = false;

    const authGuardOptions =  data && data.authGuardOptions ? data.authGuardOptions : this.defaultAuthGuardOptions;

    authGuardOptions.authConds.forEach( authConds => {
      if ( this.loggedInUser.authenticationState ===  authConds ) {
        isAuthCondSatisfy = true;
      }
    });

    if ( authGuardOptions.authCondProceedOrigLink && isAuthCondSatisfy) {
      return true;
    }

    if ( authGuardOptions.authCondProceedOrigLink && !isAuthCondSatisfy ) {
      this.router.navigate( [ authGuardOptions.authCondRedirectUrl ] );
      return false;
    }

    if ( !authGuardOptions.authCondProceedOrigLink && isAuthCondSatisfy ) {
      this.router.navigate( [ authGuardOptions.authCondRedirectUrl ] );
      return false;
    }

    if ( !authGuardOptions.authCondProceedOrigLink && !isAuthCondSatisfy ) {
      return true;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
