import { Injectable, OnDestroy } from '@angular/core';
import { TopMenuItem } from '../veriguide-common-type/top-menu-item';
import { UrlPathConfig } from '../veriguide-common-type/url-path-config';
import { UserService } from './user-service';
import { veriguideInjectors, URL_PATH_CONFIG } from '../veriguide-common-type/veriguide-injectors';
import { LoggedInUser, AuthenticationStateEnum } from '../veriguide-model/models';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserMenuContainer } from '../veriguide-common-type/user-menu-container';
import { ContentMenuItem } from '../veriguide-common-type/content-menu-item';
import { Instructor, Student } from '../veriguide-model/rest-api-response/User';

@Injectable({
    providedIn: 'root'
})
export class MenuBuilderService implements OnDestroy {

    private subscription: Subscription;

    private userMenuContainerObservable = new BehaviorSubject<UserMenuContainer>(new UserMenuContainer() );

    constructor( private userService: UserService ) {

      this.subscription = this.userService.getLoggedInUser().subscribe( loggedInUser => {

          const userMenuContainer = new UserMenuContainer();
          userMenuContainer.loggedInUser = loggedInUser;
          if ( loggedInUser.authenticationState === AuthenticationStateEnum.Authenticated ) {
              userMenuContainer.topMenuItems = this.createTopMenuItems( loggedInUser );
              userMenuContainer.contentMenuItems = this.createContentMenuItems( loggedInUser );
          }

          this.userMenuContainerObservable.next( userMenuContainer );
      });
    }

    getUserMenuContainer(): BehaviorSubject<UserMenuContainer> {
      return this.userMenuContainerObservable;
    }

    private createTopMenuItems( loggedInUser: LoggedInUser ): TopMenuItem[]  {

      console.log('createTopMenuItems: ' + loggedInUser.userId );

      const topMenuItems: TopMenuItem[] = new Array();
      if ( loggedInUser.userType === Instructor ) {
        topMenuItems.push({
          name: 'Courses',
          url: veriguideInjectors.get(URL_PATH_CONFIG).userCourses.fullPath
        });
      }

      if ( loggedInUser.userType === Student ) {
        topMenuItems.push({
          name: 'menu.submission',
          url: veriguideInjectors.get(URL_PATH_CONFIG).userSubmissionUpload.fullPath
        });
  
        topMenuItems.push({
          name: 'topmenu.submissionHistory',
          url: veriguideInjectors.get(URL_PATH_CONFIG).userAssignmentSubmissionHistory.fullPath
        });
      }

      topMenuItems.push({
        name: 'User',
        url: veriguideInjectors.get(URL_PATH_CONFIG).userRegistrationPage.fullPath.replace( ':userId', loggedInUser.userId )
      });

      /*
      topMenuItems.push({
        name: 'menu.submission',
        url: this.urlPathConfig.userSubmissionUpload.fullPath
      });

      topMenuItems.push({
        name: 'topmenu.submissionHistory',
        url: this.urlPathConfig.userAssignmentSubmissionHistory.fullPath
      });

      topMenuItems.push({
        name: 'topmenu.assignmentDeadline',
        url: this.urlPathConfig.userAssignmentDeadline.fullPath
      });
      */ 

      return topMenuItems;
    }

    private createContentMenuItems( loggedInUser: LoggedInUser ): ContentMenuItem[]  {
      const contentMenuItems: ContentMenuItem[] = new Array();

      if ( loggedInUser.userType === Instructor ) {
        contentMenuItems.push({
          name: 'My Courses',
          iconPath: 'assets/images/veriguide-main/info.png',
          description: 'Teaching Courses by Academic Year',
          url: veriguideInjectors.get(URL_PATH_CONFIG).userCourses.fullPath
        } );
      }

      if ( loggedInUser.userType === Student ) {
        contentMenuItems.push( {
          name: 'contentMenu.assignmentSubmission',
          iconPath: 'assets/images/veriguide-main/upload_2.png',
          description: 'contentMenu.assignmentSubmission.desc',
          url: veriguideInjectors.get(URL_PATH_CONFIG).userSubmissionUpload.fullPath
        });

        contentMenuItems.push({
          name: 'contentMenu.submissionHistory',
          iconPath: 'assets/images/veriguide-main/history.png',
          description: 'contentMenu.submissionHistory.desc',
          url: veriguideInjectors.get(URL_PATH_CONFIG).userAssignmentSubmissionHistory.fullPath
        });
      }
      /*
      contentMenuItems.push({
        name: 'contentMenu.course',
        iconPath: 'assets/images/veriguide-main/info.png',
        description: 'contentMenu.course.desc',
        url: this.urlPathConfig.userCourses.fullPath
      } );

      contentMenuItems.push({
        name: 'contentMenu.assignmentDeadline',
        iconPath: 'assets/images/veriguide-main/deadline.png',
        description: 'contentMenu.assignmentDeadline.desc',
        url: this.urlPathConfig.userAssignmentDeadline.fullPath
      } );
      */
      contentMenuItems.push({
        name: 'User Settings',
        iconPath: 'assets/images/veriguide-main/personnel.png',
        description: 'Click here to change user settings',
        url: veriguideInjectors.get(URL_PATH_CONFIG).userRegistrationPage.fullPath.replace( ':userId', loggedInUser.userId )
       } );

      return contentMenuItems;
    }

    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }
}
