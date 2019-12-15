import { Injectable, OnDestroy } from '@angular/core';
import { TopMenuItem } from '../veriguide-common-type/top-menu-item';
import { UrlPathConfig } from '../veriguide-common-type/url-path-config';
import { UserService } from './user-service';
import { veriguideInjectors, URL_PATH_CONFIG } from '../veriguide-common-type/veriguide-injectors';
import { LoggedInUser, AuthenticationStateEnum } from '../veriguide-model/models';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserMenuContainer } from '../veriguide-common-type/user-menu-container';
import { ContentMenuItem } from '../veriguide-common-type/content-menu-item';
import { Instructor } from '../veriguide-model/rest-api-response/User';

@Injectable({
    providedIn: 'root'
})
export class MenuBuilderService implements OnDestroy {
    private urlPathConfig: UrlPathConfig;
    private subscription: Subscription;

    private userMenuContainerObservable = new BehaviorSubject<UserMenuContainer>(new UserMenuContainer() );

    constructor( private userService: UserService ) {
      this.urlPathConfig = veriguideInjectors.get(URL_PATH_CONFIG);
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
      const topMenuItems: TopMenuItem[] = new Array();
      if ( loggedInUser.userType === Instructor ) {
        topMenuItems.push({
          name: 'topmenu.course',
          url: this.urlPathConfig.userCourses.fullPath
        });
      }
      
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

      return topMenuItems;
    }

    private createContentMenuItems( loggedInUser: LoggedInUser ): ContentMenuItem[]  {
      const contentMenuItems: ContentMenuItem[] = new Array();

      if ( loggedInUser.userType === Instructor ) {
        contentMenuItems.push({
          name: 'My Courses',
          iconPath: 'assets/images/veriguide-main/info.png',
          description: 'Teaching Courses by Academic Year',
          url: this.urlPathConfig.userCourses.fullPath
        } );        
      }
      contentMenuItems.push( {
        name: 'contentMenu.assignmentSubmission',
        iconPath: 'assets/images/veriguide-main/upload_2.png',
        description: 'contentMenu.assignmentSubmission.desc',
        url: this.urlPathConfig.userSubmissionUpload.fullPath
      });

      contentMenuItems.push({
        name: 'contentMenu.submissionHistory',
        iconPath: 'assets/images/veriguide-main/history.png',
        description: 'contentMenu.submissionHistory.desc',
        url: this.urlPathConfig.userAssignmentSubmissionHistory.fullPath
      });

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

      contentMenuItems.push({
        name: 'contentMenu.personnel',
        iconPath: 'assets/images/veriguide-main/personnel.png',
        description: 'contentMenu.personnel.desc',
        url: this.urlPathConfig.userPersonnel.fullPath
       } );

      return contentMenuItems;
    }

    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }
}
