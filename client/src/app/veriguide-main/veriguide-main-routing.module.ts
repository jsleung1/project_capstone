import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GotoUrlAuthGuard } from '../veriguide-user-service/guard/goto-url-auth.guard';
import { veriguideInjectors, URL_PATH_CONFIG } from '../veriguide-common-type/veriguide-injectors';
import { MainMenuComponent } from '../veriguide-common-ui/common-ui';

const routes: Routes = [
  {
    path: '',
    component: MainMenuComponent,
    canActivate: [ GotoUrlAuthGuard ]
  },
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
