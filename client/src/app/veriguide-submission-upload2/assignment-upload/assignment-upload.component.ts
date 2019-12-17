import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {NgbCalendar, NgbDate, NgbDatepickerI18n, NgbDateStruct, NgbTimepickerConfig, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {CustomDatepickerI18n} from '../../veriguide-common-type/custom-datepicker';
import { AcadYearsNumber } from 'src/app/veriguide-model/clientConstants';
import { User } from 'src/app/veriguide-model/rest-api-response/User';
import { Course } from 'src/app/veriguide-model/rest-api-response/Course';
import { Assignment } from 'src/app/veriguide-model/rest-api-response/Assignment';
import { ActivatedRoute, Router } from '@angular/router';
import { VeriguideHttpClient } from 'src/app/veriguide-rest-service/veriguide-http-client';
import { AlertDialogService } from 'src/app/veriguide-common-ui/dialog/alert-dialog/alert-dialog-service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-assignment-upload',
  templateUrl: './assignment-upload.component.html',
  styleUrls: ['./assignment-upload.component.scss'],
  providers: [
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
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
    // display filename
    const fileName = event.target.files[0].name;
    console.log(fileName);

    // file data
    const dataFile = event.target.files.length > 0 ? event.target.files[0] : null;
    console.log(dataFile);
  }

  UploadSubmission() {

  }

  isEnableUploadSubmissionButton() : boolean {
    return true;
  }

  ngOnDestroy(): void {
  }
}
