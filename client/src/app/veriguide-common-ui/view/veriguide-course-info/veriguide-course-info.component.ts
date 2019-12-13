import { UserCourseResolverService } from './../../../veriguide-course/user-course-resolver.service';
import { UserService } from 'src/app/veriguide-user-service/user-service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoggedInUser, AuthenticationStateEnum } from '../../../veriguide-model/models';
import { Subscription } from 'rxjs';
import { VeriguideHttpClient } from '../../../veriguide-rest-service/veriguide-http-client';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-veriguide-course-info',
  templateUrl: './veriguide-course-info.component.html',
  styleUrls: ['./veriguide-course-info.component.css']
})
export class VeriguideCourseInfoComponent implements OnInit, OnDestroy {

  private loggedInUser: LoggedInUser = { authenticationState: AuthenticationStateEnum.NeedToLogin };
  private subscription: Subscription;

  constructor( private userService: UserService,
               private veriguideHttpClient: VeriguideHttpClient,
               private userCourseResolverService: UserCourseResolverService,
               private spinner: NgxSpinnerService  ) {
    this.subscription = this.userService.getLoggedInUser().subscribe( loggedInUser => {
      this.loggedInUser = loggedInUser;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
