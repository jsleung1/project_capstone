import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { VeriguideHttpClient } from 'src/app/veriguide-rest-service/veriguide-http-client';
import { UserService } from '../user-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Submission } from 'src/app/veriguide-model/rest-api-response/Submission';
import { Assignment } from 'src/app/veriguide-model/rest-api-response/Assignment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadSubmissionsResolverService implements Resolve<Array<Submission>>  {

  constructor(private veriguideHttpClient: VeriguideHttpClient,
    private userService: UserService,
    private spinner: NgxSpinnerService  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Submission[] |
    Observable<Submission[]> | Promise<Submission[]> {

    const assignmentId = route.paramMap.get('assignmentId');
    let observableResult;

    this.spinner.show();

    let urlPath = `submissions/${assignmentId}`;

    if ( assignmentId ) {
      urlPath = `submissions/${assignmentId}`;
    } else {
      urlPath = `submissions`;
    }

    observableResult = this.veriguideHttpClient.get<Array<Submission>>( urlPath );
    observableResult.subscribe(submissions => {
      console.log( JSON.stringify( submissions ));
      this.spinner.hide();
    });
    
    return observableResult;
  }
}
