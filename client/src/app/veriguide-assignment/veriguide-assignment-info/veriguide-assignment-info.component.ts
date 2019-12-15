import { Component, OnInit } from '@angular/core';
import { Assignment } from 'src/app/veriguide-model/rest-api-response/Assignment';
import { ActivatedRoute, Router } from '@angular/router';
import { VeriguideHttpClient } from 'src/app/veriguide-rest-service/veriguide-http-client';
import { AlertDialogService } from 'src/app/veriguide-common-ui/dialog/alert-dialog/alert-dialog-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbDatepickerI18n, NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerI18n } from 'src/app/veriguide-common-type/custom-datepicker';
import { AssignmentInfo } from './assignment-info';
import { UpdateAssignmentRequest } from 'src/app/veriguide-model/rest-api-request/assignment/UpdateAssignmentRequest';

@Component({
  selector: 'app-veriguide-assignment-info',
  templateUrl: './veriguide-assignment-info.component.html',
  styleUrls: ['./veriguide-assignment-info.component.scss'],
  providers: [
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},
    NgbTimepickerConfig
  ]
})
export class VeriguideAssignmentInfoComponent implements OnInit {

  private assignmentInfos: Array<AssignmentInfo> = [];
  private courseId = '';

  constructor( private activatedRoute: ActivatedRoute,
    private veriguideHttpClient: VeriguideHttpClient,
    private alertDialogService: AlertDialogService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private config: NgbTimepickerConfig  ) {

    config.spinners = false;

    this.courseId = this.route.snapshot.paramMap.get('courseId');
    this.activatedRoute.data.subscribe( data => {
      const assignments: Array<Assignment> = data["userResolverService"];
      this.addToAssignmentInfos(assignments);
    })
  }

  private addToAssignmentInfos(assignments: Assignment[]) {
    assignments.forEach(assignment => {
      const year = Number(assignment.dueDate.split("-")[0].slice(0, 4));
      const month = Number(assignment.dueDate.split("-")[1].slice(0, 2));
      const day = Number(assignment.dueDate.split("-")[2].slice(0, 2));
      const parts = assignment.dueDate.split("_");
      const hour = Number(parts[1].split(":")[0].slice(0, 2));
      const minute = Number(parts[1].split(":")[1].slice(0, 2));
      this.assignmentInfos.push({
        assignment,
        ngbDateStruct: {
          year,
          month,
          day
        },
        ngbTimeStruct: {
          hour,
          minute,
          second: 0
        }
      });
    });
  }

  async onUpdateAssignment(assignmentInfo: AssignmentInfo) {

    const year = assignmentInfo.ngbDateStruct.year.toString();
   
    const month = assignmentInfo.ngbDateStruct.month.toString().padStart(2, '0');
    const day = assignmentInfo.ngbDateStruct.day.toString().padStart(2, '0');
    
    const hour = assignmentInfo.ngbTimeStruct.hour.toString().padStart(2, '0');
    const minute = assignmentInfo.ngbTimeStruct.minute.toString().padStart(2, '0');
    const second = assignmentInfo.ngbTimeStruct.second.toString().padStart(2, '0');

    const dueDate = `${year}-${month}-${day}_${hour}:${minute}:${second}`;

    const updateAssignmentRequest: UpdateAssignmentRequest = {
      assignmentDescription: assignmentInfo.assignment.assignmentDescription,
      dueDate
    };

    this.spinner.show();
    try {
      const updatedAssignment = await this.veriguideHttpClient.patch(`assignments/${assignmentInfo.assignment.assignmentId}`, updateAssignmentRequest ).toPromise() as Assignment;
      this.spinner.hide();
      this.alertDialogService.openDialog({
        title: 'Update Assignment',
        message: 'Successfully updated the assignment.',
        dialogType: 'OKDialog'
      }).then( res => {
      });
    } 
    catch(err) {
      this.spinner.hide();
      console.error(err);
    }
  }

  async onDeleteAssigment(assignmentInfo: AssignmentInfo) {
    console.log( assignmentInfo.assignment.assignmentId);
    this.spinner.show();
    try {
      const deletedAssignment = await this.veriguideHttpClient.delete(`assignments/${assignmentInfo.assignment.assignmentId}`).toPromise() as Assignment;
      await this.reloadAssignments();
      this.spinner.hide();
      this.alertDialogService.openDialog({
        title: 'Delete Assignment',
        message: 'Successfully deleted the assignment.',
        dialogType: 'OKDialog'
      }).then( res => {
      });
    } 
    catch(err) {
      this.spinner.hide();
      console.error(err);
    }
  } 

  ngOnInit() {
  }

  async reloadAssignments() {
   
    const assignments = await this.veriguideHttpClient.get<Array<Assignment>>(`assignments/${this.courseId}`).toPromise();
    this.assignmentInfos = [];
    this.addToAssignmentInfos(assignments);
  }
}
