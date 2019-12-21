import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbDateStruct, NgbTimepickerConfig, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

import { AcadYearsNumber } from 'src/app/veriguide-model/clientConstants';
import { User } from 'src/app/veriguide-model/rest-api-response/User';
import { Course } from 'src/app/veriguide-model/rest-api-response/Course';
import { Assignment } from 'src/app/veriguide-model/rest-api-response/Assignment';
import { ActivatedRoute, Router } from '@angular/router';
import { VeriguideHttpClient } from 'src/app/veriguide-rest-service/veriguide-http-client';
import { AlertDialogService } from 'src/app/common-ui/dialog/alert-dialog/alert-dialog-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateSubmissionRequest } from 'src/app/veriguide-model/rest-api-request/submission/CreateSubmissionRequest';
import { Submission } from 'src/app/veriguide-model/rest-api-response/Submission';
import { verimarkerInjectors, URL_PATH_CONFIG } from 'src/app/common-type/verimarker-injectors';
import { UtilService } from 'src/app/veriguide-user-service/util.service';

@Component({
  selector: 'app-assignment-upload',
  templateUrl: './assignment-upload.component.html',
  styleUrls: ['./assignment-upload.component.scss'],
})
export class AssignmentUploadComponent implements OnInit, OnDestroy  {

  acadYears = AcadYearsNumber;
  selectedAcadYear = this.acadYears[0]

  instructors: User[] = new Array<User>();
  selectedInstructor: User;

  courses: Course[] = new Array<Course>();
  selectedCourse: Course;
  courseDescription = '';

  assignments: Assignment[] = new Array<Assignment>();
  selectedAssignment: Assignment;
  assignmentDescription = '';
  ngbDateStruct: NgbDateStruct;
  ngbTimeStruct: NgbTimeStruct ;

  selectedFileName: string;
  selectedFile: any;

  studentReferences = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private veriguideHttpClient: VeriguideHttpClient,
    private alertDialogService: AlertDialogService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private config: NgbTimepickerConfig  ) {

    this.config.spinners = false;
    this.activatedRoute.data.subscribe( data => {
      this.instructors = data.resolverService;
    });
  }

  ngOnInit(): void {
  }


  onInstructorSelection() {
    this.tryToLoadCourses();
  }

  onAcadYearSelection() {
    this.tryToLoadCourses();
  }

  tryToLoadCourses() {
    if ( this.selectedInstructor !== undefined ) {
      this.spinner.show();
      this.veriguideHttpClient.get<Course[]>(`instructor/${ this.selectedInstructor.userId}/courses/${this.selectedAcadYear.toString()}`)
        .subscribe( courses => {
          this.spinner.hide();
          this.courses = courses;
        })
    }
  }

  onCourseSelection() {
    this.courseDescription = this.selectedCourse.courseDescription;
    if ( this.selectedCourse !== undefined ) {
      this.spinner.show();
      this.veriguideHttpClient.get<Assignment[]>(`assignments/${this.selectedCourse.courseId}`)
        .subscribe( assignments => {
          this.spinner.hide();
          this.assignments = assignments;
        })
    }
  }

  onAssignmentSelection() {
    this.assignmentDescription = this.selectedAssignment.assignmentDescription;
    const year = Number(this.selectedAssignment.dueDate.split('-')[0].slice(0, 4));
    const month = Number(this.selectedAssignment.dueDate.split('-')[1].slice(0, 2));
    const day = Number(this.selectedAssignment.dueDate.split('-')[2].slice(0, 2));
    const parts = this.selectedAssignment.dueDate.split('_');
    const hour = Number(parts[1].split(':')[0].slice(0, 2));
    const minute = Number(parts[1].split(':')[1].slice(0, 2));
    this.ngbDateStruct = {
      year,
      month,
      day
    };
    this.ngbTimeStruct = {
      hour,
      minute,
      second: 0
    }
  }

  onChangeFileValue(event: any) {
    if ( event.target.files.length ) {
      this.selectedFileName = event.target.files[0].name;
      this.selectedFile = event.target.files[0];
    }
  }

  async UploadSubmission() {

    try {
      const createSubmissionRequest: CreateSubmissionRequest = {
        assignmentId: this.selectedAssignment.assignmentId,
        fileName: this.selectedFileName,
        studentReferences: this.studentReferences
      }

      this.spinner.show();
      const createdSubmission = await this.veriguideHttpClient.post(`submissions`, createSubmissionRequest).toPromise() as Submission;
  
      console.log(  JSON.stringify( createdSubmission ) );

      await this.veriguideHttpClient.put( createdSubmission.submissionUploadUrl, this.selectedFile, true, true ).toPromise();
     
      this.spinner.hide();
      this.alertDialogService.openDialog({
        title: 'Upload New Submission',
        message: 'Successfully uploaded submission to VeriGuide.',
        dialogType: 'OKDialog'
      }).then( res => {
        this.router.navigate( [ verimarkerInjectors.get(URL_PATH_CONFIG).userMainPage.fullPath ] );
      });
    } catch (e) {
      this.spinner.hide();
      console.log(e) 
    }
  
  }

  isEnableUploadSubmissionButton() : boolean {
    return this.selectedInstructor !== undefined 
      && this.selectedAcadYear !== undefined 
      && this.selectedCourse !== undefined
      && this.selectedAssignment !== undefined
      && this.selectedFileName !== undefined
      && ! UtilService.isStringEmpty( this.studentReferences )
  }

  ngOnDestroy(): void {
  }
}
