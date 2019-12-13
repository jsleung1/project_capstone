import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainMenuComponent } from '../veriguide-common-ui/common-ui';
import { GotoUrlAuthGuard } from '../veriguide-common-type/guard/goto-url-auth.guard';
import { veriguideInjectors, URL_PATH_CONFIG } from '../veriguide-common-type/veriguide-injectors';
import { AssignmentUploadComponent } from './assignment-upload/assignment-upload.component';

const routes: Routes = [
  {
    path: '',
    component: MainMenuComponent,
    canActivate: [ GotoUrlAuthGuard ]
  },
  {
    path: veriguideInjectors.get(URL_PATH_CONFIG).userAssignmentSubmissionUpload.relativePath,
    component: AssignmentUploadComponent,
    canActivate: [ GotoUrlAuthGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VeriguideSubmissionUpload2RoutingModule {
}
