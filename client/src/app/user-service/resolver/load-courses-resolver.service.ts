import { Injectable } from '@angular/core';
import { Resolve,
         RouterStateSnapshot,
         ActivatedRouteSnapshot
} from '@angular/router';
import { VerimarkerHttpClient } from '../../rest-service/verimarker-http-client';
import { Observable, Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Course } from '../../model/rest-api-response/Course';


@Injectable({
  providedIn: 'root'
})
export class LoadCoursesResolverService implements Resolve<Array<Course>> {
  constructor( private veriguideHttpClient: VerimarkerHttpClient,
               private spinner: NgxSpinnerService  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Course>> | Observable<never> {
    this.spinner.show();

    //for instructor
    const observableResult = this.veriguideHttpClient.get<Array<Course>>('courses');    
    observableResult.subscribe( courses => {
      this.spinner.hide();
    });

    return observableResult;
  }
}
