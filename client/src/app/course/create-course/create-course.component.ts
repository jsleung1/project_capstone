import { Component, OnInit } from '@angular/core';
import { AcadYearsNumber } from '../../model/clientConstants';
import { Course } from '../../model/rest-api-response/Course';
import { UtilService } from '../../veriguide-user-service/util.service';
import { AlertDialogService } from 'src/app/common-ui/dialog/alert-dialog/alert-dialog-service';
import { VerimarkerHttpClient } from 'src/app/rest-service/verimarker-http-client';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateCourseRequest } from 'src/app/model/rest-api-request/course/CreateCourseRequest';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnInit {

  acadYears = AcadYearsNumber;
  
  course: Course = {
    courseCode: '',
    courseDescription: '',
    acadYear: 0
  }
  constructor( private veriguideHttpClient: VerimarkerHttpClient,
               private alertDialogService: AlertDialogService,
               private spinner: NgxSpinnerService,
               private route: ActivatedRoute,
               private router: Router ) {
  }

  ngOnInit() {

    const acadYear = this.route.snapshot.paramMap.get('acadYear');
    
    Number(acadYear)
    const acadYearToUse = this.acadYears.find(  s => s == Number(acadYear) );
    this.course.acadYear = acadYearToUse;
  }

  isEnableCreateCourseButton() {
    return ! UtilService.isStringEmpty( this.course.courseCode )
      && ! UtilService.isStringEmpty( this.course.courseDescription );     
  }

  async onCreateNewCourse() {
    const createUserRequest: CreateCourseRequest = {
      acadYear: this.course.acadYear,
      courseCode: this.course.courseCode,
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
        this.router.navigate( [ '../../' ] , { relativeTo: this.route } );
      });

    } catch (e) {
      this.spinner.hide();
      console.log(e);
    }
  }
}
