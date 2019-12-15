import { Component, OnInit, OnDestroy } from '@angular/core';
import { VeriguideHttpClient } from '../../veriguide-rest-service/veriguide-http-client';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from 'src/app/veriguide-model/rest-api-response/Course';
import { UpdateCourseRequest } from 'src/app/veriguide-model/rest-api-request/course/UpdateCourseRequest';
import { AlertDialogService } from 'src/app/veriguide-common-ui/dialog/alert-dialog/alert-dialog-service';
import { AcadYearsString } from 'src/app/veriguide-model/clientConstants';
import { veriguideInjectors, URL_PATH_CONFIG } from 'src/app/veriguide-common-type/veriguide-injectors';

@Component({
  selector: 'app-veriguide-course-info',
  templateUrl: './veriguide-course-info.component.html',
  styleUrls: ['./veriguide-course-info.component.scss']
})
export class VeriguideCourseInfoComponent implements OnInit {

  private courses: Array<Course> = [];
  private filteredCourses: Array<Course> = [];

  private acadYears = AcadYearsString;
  private selectedAcadYear = 'All';

  constructor( private activatedRoute: ActivatedRoute,
               private veriguideHttpClient: VeriguideHttpClient,
               private alertDialogService: AlertDialogService,
               private spinner: NgxSpinnerService,
               private route: ActivatedRoute,
               private router: Router  ) {

    this.activatedRoute.data.subscribe( data => {
      this.courses =  data["userResolverService"];
      this.filterCourse();
    })
  }

  ngOnInit() {
  }

  onAcadYearSelection() {
    this.filterCourse();
  }

  onCreateCourse() {
    this.router.navigate( [ veriguideInjectors.get(URL_PATH_CONFIG).userCreateCourse.fullPath ] );
  }

  openCourse(course: Course) {  
    const url =  `${course.courseId}/${veriguideInjectors.get(URL_PATH_CONFIG).userAssignments.relativePath}`;
    this.router.navigate( [ url ], { relativeTo: this.route } );
  }

  async onUpdateCourse(course: Course) {
   
    const updateCourseRequest: UpdateCourseRequest = {
      courseDescription: course.courseDescription
    };

    this.spinner.show();
    try {
      const updatedCourse = await this.veriguideHttpClient.patch(`courses/${course.courseId}`, updateCourseRequest ).toPromise() as Course;
      this.spinner.hide();
      this.alertDialogService.openDialog({
        title: 'Update Course',
        message: 'Successfully updated the course.',
        dialogType: 'OKDialog'
      }).then( res => {
      });
    } 
    catch(err) {
      this.spinner.hide();
      console.error(err);
    }

  }

  onCourseCreateAssignment(course: Course) {
    console.log(course);
  }

  async onDeleteCourse(course: Course) {
    this.spinner.show();
    try {
      const deletedCourse = await this.veriguideHttpClient.delete(`courses/${course.courseId}`).toPromise() as Course;
      await this.reloadCourses();
      this.spinner.hide();
      this.alertDialogService.openDialog({
        title: 'Delete Course',
        message: 'Successfully deleted the course.',
        dialogType: 'OKDialog'
      }).then( res => {
      });
    } 
    catch(err) {
      this.spinner.hide();
      console.error(err);
    }
  }

  filterCourse() {
    if ( this.selectedAcadYear === 'All') {
      this.filteredCourses = this.courses.filter( c => { return true; });
    } else {
      this.filteredCourses = this.courses.filter( c => c.acadYear == Number(this.selectedAcadYear) );
    }
  }

  async reloadCourses() {
    this.courses = await this.veriguideHttpClient.get<Array<Course>>(`courses`).toPromise();
    this.filterCourse();
  }
}
