import { DownloadCellGridComponent } from './../veriguide-common-ui/grid/download-cell-grid/download-cell-grid.component';
import { Injectable, OnDestroy } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserAssignmentsDTO } from '../veriguide-model/server-model/userAssignmentsDTO';
import { VeriguideHttpClient } from '../veriguide-rest-service/veriguide-http-client';
import { UserService } from '../veriguide-user-service/user-service';
import { LoggedInUser, AuthenticationStateEnum } from '../veriguide-model/models';
import { Observable, Subscription } from 'rxjs';
import { LabelurlCellGridComponent } from '../veriguide-common-ui/grid/labelurl-cell-grid/labelurl-cell-grid.component';
import { TranslateService } from '@ngx-translate/core';
import { VeriguideGridService } from '../veriguide-common-ui/common-ui';
import { Assignment } from '../veriguide-model/rest-api-response/Assignment';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class UserAssignmentResolverService implements Resolve<Array<Assignment>>, OnDestroy  {

  private subscription: Subscription;
  private loggedInUser: LoggedInUser = { authenticationState: AuthenticationStateEnum.NeedToLogin };

  constructor(private veriguideHttpClient: VeriguideHttpClient,
              private userService: UserService,
              private spinner: NgxSpinnerService  ) {

    this.subscription = this.userService.getLoggedInUser().subscribe(loggedInUser => {
      this.loggedInUser = loggedInUser;
    });
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Assignment[] |
    Observable<Assignment[]> | Promise<Assignment[]> {

    this.spinner.show();

    const baseQueryUrl = 'assignments/' + route.paramMap.get('courseId');
    const observableResult = this.veriguideHttpClient.get<Array<Assignment>>( baseQueryUrl );

    observableResult.subscribe(assignments => {
      console.log( JSON.stringify( assignments ));
      this.spinner.hide();
    });

    return observableResult;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
