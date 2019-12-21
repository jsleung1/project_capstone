import { Component, OnInit } from '@angular/core';
import { VeriguideHttpClient } from 'src/app/veriguide-rest-service/veriguide-http-client';
import { AlertDialogService } from 'src/app/veriguide-common-ui/dialog/alert-dialog/alert-dialog-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { Course } from 'src/app/veriguide-model/rest-api-response/Course';
import { UtilService } from 'src/app/veriguide-user-service/util.service';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateAssignmentRequest } from 'src/app/veriguide-model/rest-api-request/assignment/CreateAssignmentRequest';
import { Assignment } from 'src/app/veriguide-model/rest-api-response/Assignment';

@Component({
  selector: 'app-create-assignment',
  templateUrl: './create-assignment.component.html',
  styleUrls: ['./create-assignment.component.scss'],
  providers: [
     NgbTimepickerConfig
  ]
})
export class CreateAssignmentComponent implements OnInit {

  private course: Course;
  private assignmentInfo = {
    assignment: {
      assignmentName: '',
      assignmentDescription: '',
      dueDate: ''
    },
    ngbDateStruct: {
      year: 2020,
      month: 2,
      day: 1
    },
    ngbTimeStruct: {
      hour: 9,
      minute: 0,
      second: 0
    }
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private veriguideHttpClient: VeriguideHttpClient,
    private alertDialogService: AlertDialogService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private config: NgbTimepickerConfig ) {

    this.config.spinners = false;
    this.activatedRoute.data.subscribe( data => {
      this.course = data.resolverService;
      console.log( JSON.stringify( this.course ));
    });

  }

  ngOnInit() {
  }

  isEnableCreateAssignmentButton() {
    return ! UtilService.isStringEmpty( this.assignmentInfo.assignment.assignmentName )
      && ! UtilService.isStringEmpty( this.assignmentInfo.assignment.assignmentDescription );
  }

  async onCreateNewAssignment() {
    const year = this.assignmentInfo.ngbDateStruct.year.toString();
    const month = this.assignmentInfo.ngbDateStruct.month.toString().padStart(2, '0');
    const day = this.assignmentInfo.ngbDateStruct.day.toString().padStart(2, '0');

    const hour = this.assignmentInfo.ngbTimeStruct.hour.toString().padStart(2, '0');
    const minute = this.assignmentInfo.ngbTimeStruct.minute.toString().padStart(2, '0');
    const second = this.assignmentInfo.ngbTimeStruct.second.toString().padStart(2, '0');

    const dueDate = `${year}-${month}-${day}_${hour}:${minute}:${second}`;

    const createAssignmentRequest: CreateAssignmentRequest = {
      courseId: this.course.courseId,
      assignmentName: this.assignmentInfo.assignment.assignmentName,
      assignmentDescription: this.assignmentInfo.assignment.assignmentDescription,
      dueDate
    };

    this.spinner.show();
    try {
      const createdAssignment = await this.veriguideHttpClient.post(`assignments`, createAssignmentRequest ).toPromise() as Assignment;
      this.spinner.hide();
      this.alertDialogService.openDialog({
        title: 'Create Assignment',
        message: 'Successfully created the assignment.',
        dialogType: 'OKDialog'
      }).then( res => {
        this.router.navigate( [ '../' ] , { relativeTo: this.route } );
      });
    } catch ( err ) {
      this.spinner.hide();
      console.error(err);
    }

  }
}
