import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GotoUrlAuthGuard } from '../veriguide-user-service/guard/goto-url-auth.guard';
import { AssignmentUploadComponent } from './assignment-upload/assignment-upload.component';

const routes: Routes = [
  {
    path: '',
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
