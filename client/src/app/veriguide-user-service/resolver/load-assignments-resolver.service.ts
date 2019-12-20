import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { VeriguideHttpClient } from '../../veriguide-rest-service/veriguide-http-client';
import { UserService } from '../user-service';
import { Observable } from 'rxjs';
import { Assignment } from '../../veriguide-model/rest-api-response/Assignment';
import { NgxSpinnerService } from 'ngx-spinner';
import { CoursesAssignmentsDTO } from 'src/app/veriguide-model/coursesAssignmentsDTO';
import { Course } from 'src/app/veriguide-model/rest-api-response/Course';

@Injectable({
  providedIn: 'root'
})
export class LoadAssignmentsResolverService implements Resolve<CoursesAssignmentsDTO>  {

  constructor(private veriguideHttpClient: VeriguideHttpClient,
              private userService: UserService,
              private spinner: NgxSpinnerService  ) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<CoursesAssignmentsDTO> {

    const courseId =  route.paramMap.get('courseId');
    if ( courseId === '0') {
      const courses = await this.veriguideHttpClient.get<Course[]>(`courses`).toPromise();
      const coursesAssignmentsDTO: CoursesAssignmentsDTO = {
        assignments: [],
        courses
      }
      return coursesAssignmentsDTO;
    }

    this.spinner.show();
    const assignments = await this.veriguideHttpClient.get<Array<Assignment>>(  `assignments/${courseId}` ).toPromise();
    const course = await this.veriguideHttpClient.get<Course>( `course/${courseId}` ).toPromise();

    let courses = [];
    courses.push( course );

    const courseAssignmentsDTO: CoursesAssignmentsDTO = {
      assignments,
      courses
    }
    this.spinner.hide();

    return courseAssignmentsDTO;
  }
}
