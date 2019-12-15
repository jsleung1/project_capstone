import { TranslateService } from '@ngx-translate/core';
import { Injectable, OnDestroy } from '@angular/core';
import { Resolve,
         RouterStateSnapshot,
         ActivatedRouteSnapshot
} from '@angular/router';
import { VeriguideHttpClient } from '../veriguide-rest-service/veriguide-http-client';
import { Observable, Subscription, Subject
         // of, EMPTY
       } from 'rxjs';
// import { mergeMap, take } from 'rxjs/operators';
import { UserCourseSectionDTO, LoggedInUser, AuthenticationStateEnum, ReportSharedUserDTO, ReportShareDialogDTO, UserPostDTO } from '../veriguide-model/models';
import { UserService } from '../veriguide-user-service/user-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddReportOwnerDialogComponent } from '../veriguide-common-ui/dialog/add-report-owner-dialog/add-report-owner-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { LabelurlCellGridComponent } from '../veriguide-common-ui/grid/labelurl-cell-grid/labelurl-cell-grid.component';
import { ActionCellGridComponent } from '../veriguide-common-ui/grid/action-cell-grid/action-cell-grid.component';
import { VeriguideGridService } from '../veriguide-common-ui/grid/veriguide-grid/veriguide-grid.service';
import { Course } from '../veriguide-model/rest-api-response/Course';


@Injectable({
  providedIn: 'root'
})
export class UserCourseResolverService implements Resolve<Array<Course>>, OnDestroy {

  private subscription: Subscription;

  constructor( private veriguideHttpClient: VeriguideHttpClient,
               private spinner: NgxSpinnerService  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Course>> | Observable<never> {
    this.spinner.show();

    const observableResult = this.veriguideHttpClient.get<Array<Course>>('courses');    
    observableResult.subscribe( courses => {
      this.spinner.hide();
    });

    return observableResult;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
