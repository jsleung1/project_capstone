import { Injectable } from '@angular/core';
import { User, Instructor } from 'src/app/model/rest-api-response/User';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { VerimarkerHttpClient } from 'src/app/rest-service/verimarker-http-client';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadInstructorsResolverService implements Resolve<User[]> {

  constructor(private veriguideHttpClient: VerimarkerHttpClient,
    private spinner: NgxSpinnerService) { 
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): User[] | Observable<User[]> | Promise<User[]> {
    const userType = Instructor

    this.spinner.show();
    const observableResult = this.veriguideHttpClient.get<User[]>(`users/${userType}`); 
    observableResult.subscribe( instructors => {
      this.spinner.hide();
    })
    return observableResult;
  }

}
