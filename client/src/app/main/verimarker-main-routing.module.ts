import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GotoUrlAuthGuard } from '../veriguide-user-service/guard/goto-url-auth.guard';
import { verimarkerInjectors, URL_PATH_CONFIG } from '../common-type/verimarker-injectors';
import { MainMenuComponent } from '../common-ui/common-ui';

const routes: Routes = [
  {
    path: '',
    component: MainMenuComponent,
    canActivate: [ GotoUrlAuthGuard ]
  },
  {
    path: verimarkerInjectors.get(URL_PATH_CONFIG).userAssignmentSubmissionHistory.relativePath,
    loadChildren: () => import('../veriguide-submission-history/verimarker-submission-history.module').then(mod => mod.VerimarkerSubmissionHistoryModule)
  },
  {
    path: verimarkerInjectors.get(URL_PATH_CONFIG).userSubmissionUpload.relativePath,
    loadChildren: () => import('../veriguide-submission-upload2/veriguide-submission-upload2.module').then(mod => mod.VeriguideSubmissionUpload2Module)
  },
  {
    path: verimarkerInjectors.get(URL_PATH_CONFIG).userCourses.relativePath,
    loadChildren: () => import('../course/verimarker-course.module').then(mod => mod.VerimarkerCourseModule)
  },
  {
    path: verimarkerInjectors.get(URL_PATH_CONFIG).userAssignments.fullPath, // actually it is a relative path, but full path for a submodule (assignment module)
    loadChildren: () => import('../assignment/verimarker-assignment.module').then(mod => mod.VerimarkerAssignmentModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class VerimarkerMainRoutingModule { }
