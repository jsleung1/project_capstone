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


@Injectable({
  providedIn: 'root'
})
export class UserCourseResolverService implements Resolve<Array<UserCourseSectionDTO>>, OnDestroy {

  private loggedInUser: LoggedInUser = { authenticationState: AuthenticationStateEnum.NeedToLogin };
  private subscription: Subscription;

  private userClickReportShare = new Subject<UserCourseSectionDTO>();

  constructor( private veriguideHttpClient: VeriguideHttpClient,
               private userService: UserService,
               private veriguideGridService: VeriguideGridService,
               private translateService: TranslateService,
               private modalService: NgbModal,
               private spinner: NgxSpinnerService  ) {

    console.log('UserCourseResolverService construct');

    this.subscription = this.userService.getLoggedInUser().subscribe( loggedInUser => {
      this.loggedInUser = loggedInUser;
    });

    this.userClickReportShare.subscribe( userCourseSectionDTO => {
      this.displayAddReportOwnerDialog( userCourseSectionDTO );
    });
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<UserCourseSectionDTO>> | Observable<never> {
    this.spinner.show();
    return this.updateCourseInVeriGuideGrid( );
  }

  public updateCourseInVeriGuideGrid( ): Observable<Array<UserCourseSectionDTO>> {

    const observableResult =  this.veriguideHttpClient.get<Array<UserCourseSectionDTO>>('courses');
    observableResult.subscribe( userCourseSectionDTOs => {

      userCourseSectionDTOs.forEach( userCourseSectionDTO => {

        userCourseSectionDTO.courseCodeUrlCellDTO = {
          labelName :  userCourseSectionDTO.courseCode,
          labelUrlLink : './' + userCourseSectionDTO.yearTermCourseCodeSection + '/assignments',
          navHistoryDataDest: '(' + userCourseSectionDTO.userName + ')'
        };

        let userNameYouTranslateLabel = '';



        userCourseSectionDTO.userNameCellDTO = {
          nonTranslateLabel : userCourseSectionDTO.userName,
          translateLabel2 : userNameYouTranslateLabel
        };

        if ( userCourseSectionDTO.canUserShare === false ) {
          userCourseSectionDTO.shareCountCellDTO = {
            translateLabel1: '--'
          };
        } else if ( userCourseSectionDTO.shareCount > 0 ) {
          userCourseSectionDTO.shareCountCellDTO = {
            translateLabel1: 'reportShare.shared',
            nonTranslateLabel:  '(' + userCourseSectionDTO.shareCount.toString() + ')',
          };
        } else {
          userCourseSectionDTO.shareCountCellDTO = {
            translateLabel1: 'reportShare.notShared'
          };
        }
      });

      this.veriguideGridService.gridInfo.next(
      {
        columnDefs: [
          { headerName: 'Year', field: 'yearTerm' },
          { headerName: 'Course Code',
            cellRendererFramework: LabelurlCellGridComponent,
            cellRendererParams: {
              value: {
                getPropertyName: 'courseCodeUrlCellDTO'
              }
            },
            getQuickFilterText: (params) =>  {
              return params.data.courseCodeUrlCellDTO.labelName;
            }
          },
          { headerName: 'Course Title', field: 'course_title' },
          { headerName: 'Teacher',
            cellRendererFramework: ActionCellGridComponent,
            cellRendererParams: {
               value: {
                getPropertyName: 'userNameCellDTO',
                cellType: 'actionLinkWithLabel'
               }
            },
            getQuickFilterText: (params) => {
              return ActionCellGridComponent.cellValueForQuickSearch( params.data.userNameCellDTO, this.translateService );
            }
          },
          { headerName: 'Enrollment', field: 'enrollmentSize' },
          { headerName: 'Share Status',
            cellRendererFramework: ActionCellGridComponent,
            cellRendererParams: {
              value: {
               getPropertyName: 'shareCountCellDTO',
               cellType: 'actionLinkWithLabel',
               onActionHandler: this.userClickReportShare
              }
            },
            getQuickFilterText: (params) => {
              return ActionCellGridComponent.cellValueForQuickSearch( params.data.shareCountCellDTO, this.translateService );
            }
          }
        ],
        records: userCourseSectionDTOs
      });

      this.spinner.hide();
    });

    return observableResult;
  }


  getGridInfo(): string {
    return 'VeriGuide Grid Info';
  }

  ngOnDestroy(): void {
    console.log('UserCourseResolverService ngOnDestroy()');
    this.subscription.unsubscribe();
  }

  displayAddReportOwnerDialog(userCourseSectionDTO: UserCourseSectionDTO): void {
    if (userCourseSectionDTO.canUserShare === false ) {
      return;
    }

    this.spinner.show();

    this.veriguideHttpClient.get<ReportShareDialogDTO>('sharing/userReportSharingList/' + userCourseSectionDTO.yearTermCourseCodeSection + '/' + userCourseSectionDTO.school_login  )
      .subscribe( reportShareDialogDTO => {
          this.spinner.hide();

          const modalRef  = this.modalService.open( AddReportOwnerDialogComponent, {
            windowClass: 'report-shared-modal-dialog',
            backdrop : 'static',
            keyboard : false
          });

          modalRef.componentInstance.loggedInUser = this.loggedInUser;
          modalRef.componentInstance.userCourseSectionDTO = userCourseSectionDTO;
          modalRef.componentInstance.reportSharedUserDTOs = reportShareDialogDTO.reportSharedUserDTOs;
          modalRef.componentInstance.reportAssignableRoleDTOs = reportShareDialogDTO.reportAssignableRoleDTOs;
          modalRef.result.then( result => {
        });
      });
  }
}
