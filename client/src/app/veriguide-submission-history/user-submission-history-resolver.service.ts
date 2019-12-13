
import { Injectable, OnDestroy } from '@angular/core';
import { Resolve,
         RouterStateSnapshot,
         ActivatedRouteSnapshot
} from '@angular/router';
import { VeriguideHttpClient } from '../veriguide-rest-service/veriguide-http-client';
import { Observable, Subscription} from 'rxjs';
import { UserSubmissionHistoryDTO, LoggedInUser, AuthenticationStateEnum } from '../veriguide-model/models';
import { UserService } from '../veriguide-user-service/user-service';
import { DownloadCellGridComponent } from '../veriguide-common-ui/grid/download-cell-grid/download-cell-grid.component';
import { TranslateService } from '@ngx-translate/core';
import { VeriguideGridService } from '../veriguide-common-ui/common-ui';

@Injectable({
  providedIn: 'root'
})
export class UserSubmissionHistoryResolverService implements Resolve<Array<UserSubmissionHistoryDTO>>, OnDestroy {

  private loggedInUser: LoggedInUser = { authenticationState: AuthenticationStateEnum.NeedToLogin };
  private subscription: Subscription;

  constructor( private veriguideHttpClient: VeriguideHttpClient,
               private userService: UserService,
               private veriguideGridService: VeriguideGridService,
               private translateService: TranslateService ) {

    this.subscription = this.userService.getLoggedInUser().subscribe( loggedInUser => {
      this.loggedInUser = loggedInUser;
    });
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UserSubmissionHistoryDTO[] |
    Observable<UserSubmissionHistoryDTO[]> | Promise<UserSubmissionHistoryDTO[]> {
    const observableResult =  this.veriguideHttpClient.get<Array<UserSubmissionHistoryDTO>>( 'submissions/submissionHistory' );

    observableResult.subscribe( UserSubmissionHistoryDTOs => {
      UserSubmissionHistoryDTOs.forEach(userSubmissionHistoryDTO => {
        userSubmissionHistoryDTO.downloadSubmissionFile = {
          downloadFileName: userSubmissionHistoryDTO.submissionFileName,
          downloadFileUrl: 'submissions/downloadFile/'  + userSubmissionHistoryDTO.yearTermCourseCodeSection
                            + '/' + userSubmissionHistoryDTO.submissionId + '/downloadSubmission',
          showDefaultDownloadLabel: false
        };

        userSubmissionHistoryDTO.downloadDeclarationFile = {
          downloadFileName: userSubmissionHistoryDTO.declarationFileName,
          downloadFileUrl: 'submissions/downloadFile/'  + userSubmissionHistoryDTO.yearTermCourseCodeSection
                            + '/' + userSubmissionHistoryDTO.submissionId + '/downloadGeneratedDeclarationFile',
          showDefaultDownloadLabel: true
        };
      });

      this.veriguideGridService.gridInfo.next(
        {
          columnDefs: [
            { headerName: 'Ref Id', field: 'submissionId', sort: 'desc' },
            { headerName: 'Submission time', field: 'submissionTime' },
            { headerName: 'Year', field: 'yearTerm' },
            { headerName: 'Course', field: 'courseCode' },
            { headerName: 'Assignment Number', field: 'assignmentNumber' },
            { headerName: 'File name',
              cellRendererFramework: DownloadCellGridComponent,
              cellRendererParams: {
                value: {
                  blobType: 'application/pdf',
                  getPropertyName: 'downloadSubmissionFile',
                }
              },
              getQuickFilterText: (params) => {
                return DownloadCellGridComponent.cellValueForQuickSearch( params.data.downloadSubmissionFile, this.translateService);
              }
            },
            { headerName: 'Declaration',
              cellRendererFramework: DownloadCellGridComponent,
              cellRendererParams: {
                value: {
                  blobType: 'application/pdf',
                  getPropertyName: 'downloadDeclarationFile',
                }
              },
              getQuickFilterText: (params) => {
                return DownloadCellGridComponent.cellValueForQuickSearch( params.data.downloadDeclarationFile, this.translateService);
              }
            }
          ],
          records: UserSubmissionHistoryDTOs
        }
      );
    });
    return observableResult;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
