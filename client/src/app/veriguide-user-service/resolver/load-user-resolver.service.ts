import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { VerimarkerHttpClient } from 'src/app/veriguide-rest-service/veriguide-http-client';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/model/rest-api-response/User';

@Injectable({
  providedIn: 'root'
})
export class LoadUserResolverService implements Resolve<User> {
  
  constructor(private veriguideHttpClient: VerimarkerHttpClient,
              private spinner: NgxSpinnerService) { 
        
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): User | Observable<User> | Promise<User> {
    
    const userId = route.paramMap.get('userId');
    if ( userId === '0' ) {
      return null;
    }

    this.spinner.show();
    const observableResult = this.veriguideHttpClient.get<User>(`user`);    
    observableResult.subscribe( user => {
      this.spinner.hide();
    });

    return observableResult;
  }


}
