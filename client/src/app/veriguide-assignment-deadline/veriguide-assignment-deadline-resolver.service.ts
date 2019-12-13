import { Injectable, OnDestroy } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, Subscription, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

import { VeriguideGridService } from './../veriguide-common-ui/grid/veriguide-grid/veriguide-grid.service';
import { VeriguideHttpClient } from '../veriguide-rest-service/veriguide-http-client';
import {
  LoggedInUser,
  AuthenticationStateEnum,
  UserPostDTO,
  AssignmentDeadLineDTO
} from '../veriguide-model/models';
import { UserService } from '../veriguide-user-service/user-service';
import { ActionCellGridComponent } from '../veriguide-common-ui/common-ui';


@Injectable({
  providedIn: 'root'
})
export class VeriguideAssignmentDeadlineResolverService implements Resolve<AssignmentDeadLineDTO[]>, OnDestroy {

  private loggedInUser: LoggedInUser = { authenticationState: AuthenticationStateEnum.NeedToLogin };
  private subscription: Subscription;

  private clickRemoveOneDeadline = new Subject<AssignmentDeadLineDTO>();

  private selectedUserPost: UserPostDTO;

  constructor( private veriguideHttpClient: VeriguideHttpClient,
               private userService: UserService,
               private veriguideGridService: VeriguideGridService,
               private translateService: TranslateService,
               // for popup dialog use
               private modalService: NgbModal,
               private spinner: NgxSpinnerService  ) {

    this.subscription = this.userService.getLoggedInUser().subscribe( loggedInUser => {
      this.loggedInUser = loggedInUser;
    });

    this.clickRemoveOneDeadline.subscribe( (rowItem: AssignmentDeadLineDTO) => {
      this.onclickRemoveOneDeadline( rowItem[0] );
    });
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): AssignmentDeadLineDTO[] |
    Observable<AssignmentDeadLineDTO[]> | Promise<AssignmentDeadLineDTO[]>  {
    const observableResult =  this.veriguideHttpClient.get<AssignmentDeadLineDTO[]>('assignmentDeadlines');
    observableResult.subscribe( AssignmentDeadLineDTOs => {

      AssignmentDeadLineDTOs.forEach( item => {
        const courseCodeItems: string[] = [item.subject_area || '', item.catalog_number || '', item.section_code || ''];
        item.courseCode = courseCodeItems.join('-');
        item.allowSubmissionAfterDeadLineYN = item.allowSubmissionAfterDeadLine ? 'assignmentDeadline.allow.yes' : 'assignmentDeadline.allow.no';
        item.removeDeadlineCellDTO = {translateLabel1 : 'assignmentDeadline.remove'};
      });

      this.veriguideGridService.gridInfo.next(
        {
          columnDefs: [
            { headerName: 'assignmentDeadline.yearTerm', field: 'yearTerm' },
            { headerName: 'assignmentDeadline.course', field: 'courseCode' },
            { headerName: 'assignmentDeadline.course.title', field: 'courseTitle' },
            { headerName: 'assignmentDeadline.assignment.no', field: 'assignment_number' },
            { headerName: 'assignmentDeadline.due.date', field: 'dueDate' },
            { headerName: 'assignmentDeadline.allow', field: 'allowSubmissionAfterDeadLineYN' },
            { headerName: 'assignmentDeadline.remove',
              cellRendererFramework: ActionCellGridComponent,
              cellRendererParams: {
                value: {
                  getPropertyName: 'removeDeadlineCellDTO',
                  cellType: 'actionLinkWithLabel',
                  onActionHandler: this.clickRemoveOneDeadline
                }
              },
              getQuickFilterText: (params) => {
                return ActionCellGridComponent.cellValueForQuickSearch( params.data.removeDeadlineCellDTO, this.translateService );
              }
            }
          ],
          records: AssignmentDeadLineDTOs
      });
    });

    return observableResult;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onclickRemoveOneDeadline(rowData: AssignmentDeadLineDTO): void {
    // may add removal confirmation dialog before remove action

    this.spinner.show();
    // send out rest API to remove assignment deadline record
    this.veriguideHttpClient.delete<any>('link_to_remove_deadline_record' )
      .subscribe( (result: any) => {
          this.spinner.hide();
    });
  }
}
