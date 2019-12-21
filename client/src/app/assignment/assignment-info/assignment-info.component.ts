import { Component, OnInit } from '@angular/core';
import { Assignment } from 'src/app/veriguide-model/rest-api-response/Assignment';
import { ActivatedRoute, Router } from '@angular/router';
import { VeriguideHttpClient } from 'src/app/veriguide-rest-service/veriguide-http-client';
import { AlertDialogService } from 'src/app/common-ui/dialog/alert-dialog/alert-dialog-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { UpdateAssignmentRequest } from 'src/app/veriguide-model/rest-api-request/assignment/UpdateAssignmentRequest';
import { verimarkerInjectors, URL_PATH_CONFIG } from 'src/app/common-type/verimarker-injectors';
import { AssignmentInfo } from '../assignment-info';
import { Course } from 'src/app/veriguide-model/rest-api-response/Course';
import { CoursesAssignmentsDTO } from 'src/app/veriguide-model/coursesAssignmentsDTO';

@Component({
  selector: 'app-assignment-info',
  templateUrl: './assignment-info.component.html',
  styleUrls: ['./assignment-info.component.scss'],
  providers: [
   NgbTimepickerConfig
  ]
})
export class AssignmentInfoComponent implements OnInit {

  private assignmentInfos: Array<AssignmentInfo> = [];

  private courseIdParam: string;
  private courseId: string;
  private assignmentCourseTitle: string;

  private courses: Course[];
  private selectedCourse: Course;

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

      const coursesAssignmentsDTO: CoursesAssignmentsDTO = data.resolverService;
      this.courseIdParam = this.route.snapshot.paramMap.get('courseId');
      this.courseId = this.courseIdParam;
      
      if ( this.courseId !== '0' ) {
        const course = coursesAssignmentsDTO.courses[0];
        const assignments = coursesAssignmentsDTO.assignments;
        this.assignmentCourseTitle = `<i class="fa fa-tasks" aria-hidden="true"></i>&nbsp;&nbsp;Viewing Assignments for Course <b>${course.courseCode}</b>`;
        this.addToAssignmentInfos(assignments);
      } else {
        this.courses = coursesAssignmentsDTO.courses;
      }
    });
  }

  async ngOnInit() {
    if ( this.courses.length > 0 ) { 
      this.selectedCourse  = this.courses[0];
      this.onCourseSelection();
    }
  }

  private addToAssignmentInfos(assignments: Assignment[]) {
    assignments.forEach(assignment => {
      const year = Number(assignment.dueDate.split('-')[0].slice(0, 4));
      const month = Number(assignment.dueDate.split('-')[1].slice(0, 2));
      const day = Number(assignment.dueDate.split('-')[2].slice(0, 2));
      const parts = assignment.dueDate.split('_');
      const hour = Number(parts[1].split(':')[0].slice(0, 2));
      const minute = Number(parts[1].split(':')[1].slice(0, 2));
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
    } catch (err) {
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
    } catch (err) {
      this.spinner.hide();
      console.error(err);
    }
  }

  async reloadAssignments() {
    const assignments = await this.veriguideHttpClient.get<Array<Assignment>>(`assignments/${this.courseId}`).toPromise();
    this.assignmentInfos = [];
    this.addToAssignmentInfos(assignments);
  }

  onViewAssigmentSubmissions(assignmentInfo: AssignmentInfo) {
    const url = verimarkerInjectors.get(URL_PATH_CONFIG).userAssignmentSubmissionHistory.fullPath.replace(':assignmentId', assignmentInfo.assignment.assignmentId)
    this.router.navigate( [ url ] );
  }

  onCreateAssignment() {


    if ( this.courseIdParam === '0') {

      const subUrl =  verimarkerInjectors.get(URL_PATH_CONFIG).userCreateAssignment.fullPath.replace(':courseId', this.courseId );
      const parentUrl = verimarkerInjectors.get(URL_PATH_CONFIG).userMainPage.fullPath;
      const url = `${parentUrl}/${subUrl}`
      this.router.navigate( [ url ] );

    } else {
      const url =  verimarkerInjectors.get(URL_PATH_CONFIG).userCreateAssignment.relativePath;
      this.router.navigate( [ url ],  { relativeTo: this.route });
    }
  }

  async onCourseSelection() {

    this.courseId = this.selectedCourse.courseId;

    this.spinner.show();
    const baseQueryUrl = `assignments/${this.courseId}`    
    const assignments = await this.veriguideHttpClient.get<Array<Assignment>>( baseQueryUrl ).toPromise();
    this.assignmentInfos = [];
    this.addToAssignmentInfos(assignments);
    this.spinner.hide();
  }

}
