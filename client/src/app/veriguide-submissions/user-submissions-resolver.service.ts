import { Injectable, OnDestroy } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserSubmissionsDTO, LoggedInUser, AuthenticationStateEnum } from '../veriguide-model/models';
import { Observable, Subscription } from 'rxjs';
import { VeriguideHttpClient } from '../veriguide-rest-service/veriguide-http-client';
import { UserService } from '../veriguide-user-service/user-service';
import { TranslateService } from '@ngx-translate/core';
import { VeriguideGridService, DownloadCellGridComponent, ReportLinkCellGridComponent, ViewSubmissionsRowStyle } from '../veriguide-common-ui/common-ui';

@Injectable({
  providedIn: 'root'
})
export class UserSubmissionsResolverService implements Resolve<Array<UserSubmissionsDTO>>, OnDestroy  {

  private loggedInUser: LoggedInUser = { authenticationState: AuthenticationStateEnum.NeedToLogin };
  private subscription: Subscription;
  private baseQueryUrl = '';

  constructor(private veriguideHttpClient: VeriguideHttpClient,
              private userService: UserService,
              private veriguideGridService: VeriguideGridService,
              private translateService: TranslateService ) {
    this.subscription = this.userService.getLoggedInUser().subscribe(loggedInUser => {
      this.loggedInUser = loggedInUser;
    });
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UserSubmissionsDTO[] |
    Observable<UserSubmissionsDTO[]> | Promise<UserSubmissionsDTO[]> {
      this.baseQueryUrl = 'submissions/'
                          + route.paramMap.get('yearTermCourseCodeSection')
                          + '/'
                          + route.paramMap.get('assignmentNumber');

      const observableResult =  this.veriguideHttpClient.get<Array<UserSubmissionsDTO>>( this.baseQueryUrl );
      observableResult.subscribe( userSubmissionsDTOs => {

          userSubmissionsDTOs.forEach( userSubmissionsDTO => {
            userSubmissionsDTO.submissionDownloadCellDTO = {
              downloadFileName : userSubmissionsDTO.fileName,
              downloadFileUrl : 'submissions/downloadFile/'  + route.paramMap.get('yearTermCourseCodeSection') + '/' + userSubmissionsDTO.submissionId + '/downloadSubmission',
              showDefaultDownloadLabel: false
            };
          });

          this.veriguideGridService.gridInfo.next(
          {
            columnDefs: [
              // { headerName: 'Assignment No.', field: 'assignment_number' },
              { headerName: 'Name', field: 'studentName' },
              { headerName: 'User Id', field: 'studentLoginId', width: 120, sort: 'asc' },
              { headerName: 'Ref Id', field: 'submissionId', width: 120 },
              { headerName: 'Submission Time', field: 'submissionTime', width: 180 },
              { headerName: 'File Name',
                cellRendererFramework: DownloadCellGridComponent,
                cellRendererParams: {
                  value: {
                    getPropertyName: 'submissionDownloadCellDTO',
                    blobType: 'application/pdf'
                  }
                },
                getQuickFilterText: (params) => {
                  return DownloadCellGridComponent.cellValueForQuickSearch( params.data.submissionDownloadCellDTO, this.translateService);
                }
              },
              { headerName: 'Similarity', field: 'similarity', width: 120 },
              { headerName: 'Reminder', field: 'reportStatus', width: 120,
                cellStyle: (params) => {
                    if ( params.value === 'NSUB') {
                      return {
                        color: '#ff0000',
                        fontWeight: 'bold'
                      };
                    } else {
                        return null;
                    }
                  }
              },
              { headerName: 'View Originality Report', width: 540,
                cellRendererFramework: ReportLinkCellGridComponent
              },
            ],
            records: userSubmissionsDTOs,
            rowStyle: new ViewSubmissionsRowStyle()
          });
      });
      return observableResult;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
