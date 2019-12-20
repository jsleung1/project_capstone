import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { VeriguideHttpClient } from 'src/app/veriguide-rest-service/veriguide-http-client';
import { NgxSpinnerService } from 'ngx-spinner';
import { Submission } from 'src/app/veriguide-model/rest-api-response/Submission';
import { Observable } from 'rxjs';
import { AssignmentsSubmissionsDTO } from 'src/app/veriguide-model/assignmentsSubmissionsDTO';
import { Assignment } from 'src/app/veriguide-model/rest-api-response/Assignment';

@Injectable({
  providedIn: 'root'
})
export class LoadSubmissionsResolverService implements Resolve<AssignmentsSubmissionsDTO>  {

  constructor(
    private veriguideHttpClient: VeriguideHttpClient,
    private spinner: NgxSpinnerService  ) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Promise<AssignmentsSubmissionsDTO> {

    const assignmentId = route.paramMap.get('assignmentId');
    this.spinner.show();

    let assignments: Assignment[] = []
    if ( assignmentId === '0') {
      const submissions = await this.veriguideHttpClient.get<Submission[]>(`submissions`).toPromise();
      const assignmentsSubmissionsDTO: AssignmentsSubmissionsDTO = {
        assignments,
        submissions
      }
      return assignmentsSubmissionsDTO;
    }

    let urlPath;
    if ( assignmentId && assignmentId !== 'all' ) {
      const assignment = await this.veriguideHttpClient.get(`assignment/${assignmentId}`).toPromise() as Assignment;
      assignments.push( assignment )
      urlPath = `submissions/assignment/${assignmentId}`; // get submissons of the assignment
    } else {
      urlPath = `submissions`; // get submissions uploaded by user
    }

    const submissions = await this.veriguideHttpClient.get<Array<Submission>>( urlPath ).toPromise()
    this.spinner.hide()

    const assignmentsSubmissionsDTO: AssignmentsSubmissionsDTO = {
      assignments,
      submissions
    }
    
    return assignmentsSubmissionsDTO;
  }
}
