import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GotoUrlAuthGuard } from '../user-service/guard/goto-url-auth.guard';
import { AssignmentUploadComponent } from './assignment-upload/assignment-upload.component';
import { LoadInstructorsResolverService } from '../user-service/resolver/load-instructors-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: AssignmentUploadComponent,
    canActivate: [ GotoUrlAuthGuard ],
    resolve: {
      resolverService: LoadInstructorsResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerimarkerSubmissionUpload2RoutingModule {
}
