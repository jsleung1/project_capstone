import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { VeriguideHttpClient } from 'src/app/veriguide-rest-service/veriguide-http-client';
import { NgxSpinnerService } from 'ngx-spinner';
import { Submission } from 'src/app/veriguide-model/rest-api-response/Submission';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadSubmissionsResolverService implements Resolve<Array<Submission>>  {

  constructor(
    private veriguideHttpClient: VeriguideHttpClient,
    private spinner: NgxSpinnerService  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Submission[] |
    Observable<Submission[]> | Promise<Submission[]> {

    const assignmentId = route.paramMap.get('assignmentId');
    let observableResult;

    this.spinner.show();

    let urlPath;

    if ( assignmentId && assignmentId !== 'all' ) {
      urlPath = `submissions/assignment/${assignmentId}`; // get submissons of the assignment
    } else {
      urlPath = `submissions`; // get submissions uploaded by user
    }

    observableResult = this.veriguideHttpClient.get<Array<Submission>>( urlPath );
    observableResult.subscribe(submissions => {
      this.spinner.hide();
    });

    return observableResult;
  }
}
