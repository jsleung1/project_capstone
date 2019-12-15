import { Component, OnInit } from '@angular/core';
import { AcadYearsNumber } from '../../veriguide-model/clientConstants';
import { Course } from '../../veriguide-model/rest-api-response/Course';
import { UtilService } from '../../veriguide-user-service/util.service';
import { AlertDialogService } from 'src/app/veriguide-common-ui/dialog/alert-dialog/alert-dialog-service';
import { VeriguideHttpClient } from 'src/app/veriguide-rest-service/veriguide-http-client';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { CreateCourseRequest } from 'src/app/veriguide-model/rest-api-request/course/CreateCourseRequest';
import { veriguideInjectors, URL_PATH_CONFIG } from 'src/app/veriguide-common-type/veriguide-injectors';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnInit {

  acadYears = AcadYearsNumber;
  
  course: Course = {
    courseName: '',
    courseDescription: '',
    acadYear: this.acadYears[0]
  }
  constructor( private veriguideHttpClient: VeriguideHttpClient,
               private alertDialogService: AlertDialogService,
               private spinner: NgxSpinnerService,
               private router: Router ) {
  }

  ngOnInit() {
  }

  isEnableCreateCourseButton() {
    return ! UtilService.isStringEmpty( this.course.courseName )
      && ! UtilService.isStringEmpty( this.course.courseDescription );     
  }

  onAcadYearSelection(acadYear: number) {

    this.course.acadYear = acadYear;
  }

  async onCreateNewCourse() {
    const createUserRequest: CreateCourseRequest = {
      acadYear: this.course.acadYear,
      courseName: this.course.courseName,
      courseDescription: this.course.courseDescription
    };

    this.spinner.show();
    try {
      const course = await this.veriguideHttpClient.post( 'courses', createUserRequest ).toPromise() as Course;
      this.spinner.hide();
      this.alertDialogService.openDialog({
        title: 'Create Course',
        message: 'Successfully created the course.',
        dialogType: 'OKDialog'
      }).then( res => {
        // navigate to the courses page
        this.router.navigate( [ veriguideInjectors.get(URL_PATH_CONFIG).userCourses.fullPath ] );
      });
   
    } catch (e) {
      this.spinner.hide();
      console.log(e);
    }
  }
}
