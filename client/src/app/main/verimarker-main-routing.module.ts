import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GotoUrlAuthGuard } from '../user-service/guard/goto-url-auth.guard';
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
    loadChildren: () => import('../submission-history/verimarker-submission-history.module').then(mod => mod.VerimarkerSubmissionHistoryModule)
  },
  {
    path: verimarkerInjectors.get(URL_PATH_CONFIG).userSubmissionUpload.relativePath,
    loadChildren: () => import('../submission-upload/verimarker-submission-upload.module').then(mod => mod.VerimarkerSubmissionUpload2Module)
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
