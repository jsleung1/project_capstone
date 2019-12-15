import { MainMenuComponent } from '../veriguide-main/main-menu/main-menu.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { veriguideInjectors, URL_PATH_CONFIG } from '../veriguide-common-type/veriguide-injectors';
import { GotoUrlAuthGuard } from '../veriguide-user-service/guard/goto-url-auth.guard';
import {
  SubmissionUploadComponent,
  SubmissionUploadFailedComponent,
  SubmissionUploadSuccessComponent
} from './veriguide-submission-upload.components';
import { VeriguideSubmissionUploadGuard } from './veriguide-submission-upload.guards';

const routes: Routes = [
  {
    path: '',
    component: MainMenuComponent,
    canActivate: [ GotoUrlAuthGuard ]
  },
  {
    path: veriguideInjectors.get(URL_PATH_CONFIG).userAssignmentSubmissionUploadSuccess.relativePath,
    component: SubmissionUploadSuccessComponent,
    canActivate: [ GotoUrlAuthGuard, VeriguideSubmissionUploadGuard ],
    data: {
      uploadCondRedirectUrl: veriguideInjectors.get(URL_PATH_CONFIG).userAssignmentSubmissionUploadSuccess.fullPath
    }
  },
  {
    path: veriguideInjectors.get(URL_PATH_CONFIG).userAssignmentSubmissionUploadFailed.relativePath,
    component: SubmissionUploadFailedComponent,
    canActivate: [ GotoUrlAuthGuard, VeriguideSubmissionUploadGuard ],
    data: {
      uploadCondRedirectUrl: veriguideInjectors.get(URL_PATH_CONFIG).userMainPage.fullPath
    }
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class VeriguideSubmissionUploadRoutingModule { }
