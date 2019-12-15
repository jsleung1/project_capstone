import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { VeriguideHttpClient } from '../../veriguide-rest-service/veriguide-http-client';
import { UserService } from '../user-service';
import { Observable } from 'rxjs';
import { Assignment } from '../../veriguide-model/rest-api-response/Assignment';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadAssignmentsResolverService implements Resolve<Array<Assignment>>  {

  constructor(private veriguideHttpClient: VeriguideHttpClient,
              private userService: UserService,
              private spinner: NgxSpinnerService  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Assignment[] |
    Observable<Assignment[]> | Promise<Assignment[]> {

    this.spinner.show();

    const baseQueryUrl = 'assignments/' + route.paramMap.get('courseId');
    const observableResult = this.veriguideHttpClient.get<Array<Assignment>>( baseQueryUrl );

    observableResult.subscribe(assignments => {
      console.log( JSON.stringify( assignments ));
      this.spinner.hide();
    });

    return observableResult;
  }
}
