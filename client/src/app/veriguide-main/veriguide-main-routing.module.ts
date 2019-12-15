import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GotoUrlAuthGuard } from '../veriguide-common-type/guard/goto-url-auth.guard';
import { veriguideInjectors, URL_PATH_CONFIG } from '../veriguide-common-type/veriguide-injectors';
import { MainMenuComponent } from '../veriguide-common-ui/common-ui';
import { Auth0ResolverService } from '../veriguide-user-service/auth0-resolver.service';
import { UserRegistrationComponent } from '../veriguide-common-ui/component/user-registration/user-registration.component';

const routes: Routes = [
  {
    path: '',
    component: MainMenuComponent,
    canActivate: [ GotoUrlAuthGuard ]
  },
  /*
  {
    // https://lms.veriguide.org:4400/school/main/auth0
    path: veriguideInjectors.get(URL_PATH_CONFIG).userAuth0CallBackPath.relativePath,
    component: MainMenuComponent,
    resolve: {
      auth0ResolverService: Auth0ResolverService
    },
  },
  */
  {
    path: veriguideInjectors.get(URL_PATH_CONFIG).userAssignmentSubmissionHistory.relativePath,
    loadChildren: () => import('../veriguide-submission-history/veriguide-submission-history.module').then(mod => mod.VeriguideSubmissionHistoryModule)
  },
  {
    path: veriguideInjectors.get(URL_PATH_CONFIG).userSubmissionUpload.relativePath,
    loadChildren: () => import('../veriguide-submission-upload2/veriguide-submission-upload2.module').then(mod => mod.VeriguideSubmissionUpload2Module)
  },
  {
    path: veriguideInjectors.get(URL_PATH_CONFIG).userCourses.relativePath,
    loadChildren: () => import('../veriguide-course/veriguide-course.module').then(mod => mod.VeriguideCourseModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class VeriguideMainRoutingModule { }
