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

@Injectable({
  providedIn: 'root'
})
export class UserAssignmentResolverService implements Resolve<Array<UserAssignmentsDTO>>, OnDestroy  {

  private subscription: Subscription;
  private loggedInUser: LoggedInUser = { authenticationState: AuthenticationStateEnum.NeedToLogin };
  private baseQueryUrl = '';

  constructor(private veriguideHttpClient: VeriguideHttpClient,
              private userService: UserService,
              private veriguideGridService: VeriguideGridService,
              private translateService: TranslateService ) {

    this.subscription = this.userService.getLoggedInUser().subscribe(loggedInUser => {
      this.loggedInUser = loggedInUser;
    });
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UserAssignmentsDTO[] |
    Observable<UserAssignmentsDTO[]> | Promise<UserAssignmentsDTO[]> {

    this.baseQueryUrl = 'assignments/' + route.paramMap.get('yearTermCourseCodeSection');

    const observableResult = this.veriguideHttpClient.get<Array<UserAssignmentsDTO>>( this.baseQueryUrl );

    observableResult.subscribe(userAssignmentDTOs => {

      userAssignmentDTOs.forEach(
        userAssignmentDTO => {
          const assignmentNumberStr = userAssignmentDTO.assignment_number.toString();

          userAssignmentDTO.assignmentNumberCellDTO = {
            labelName : 'common.assignment',
            labelValue1 : assignmentNumberStr,
            labelUrlLink :  './' + assignmentNumberStr + '/submissions'
          };

          userAssignmentDTO.assignmentDownloadCellDTO = {
            downloadFileName :  route.paramMap.get('yearTermCourseCodeSection') + '-' +  userAssignmentDTO.assignment_number  + '.zip',
            downloadFileUrl : this.baseQueryUrl + '/' + userAssignmentDTO.assignment_number + '/downloadFiles',
            showDefaultDownloadLabel: true
          };
        }
      );

      this.veriguideGridService.gridInfo.next(
        {
          columnDefs: [
            // { headerName: 'Assignment No.', field: 'assignment_number' },
            { headerName: 'Assignment No.',
              cellRendererFramework: LabelurlCellGridComponent,
              cellRendererParams: {
                value: {
                  getPropertyName: 'assignmentNumberCellDTO'
                }
              },
              getQuickFilterText: (params) => {
                return this.translateService.instant( params.data.assignmentNumberCellDTO.labelName )
                  + ' ' + params.data.assignmentNumberCellDTO.labelValue1;
              }
            },
            { headerName: 'Submission', field: 'num_of_submissions' },
            { headerName: 'Last submission time', field: 'submission_time' },
            { headerName: 'Download',
              cellRendererFramework: DownloadCellGridComponent,
              cellRendererParams: {
                value: {
                  blobType: 'application/zip',
                  getPropertyName: 'assignmentDownloadCellDTO'
                }
              },
              getQuickFilterText: (params) => {
                return DownloadCellGridComponent.cellValueForQuickSearch( params.data.assignmentDownloadCellDTO , this.translateService);
              }
            },
          ],
          records: userAssignmentDTOs
        });
    });

    return observableResult;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
