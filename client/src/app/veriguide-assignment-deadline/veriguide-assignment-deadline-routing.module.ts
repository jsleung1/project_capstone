import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {GotoUrlAuthGuard} from '../veriguide-common-type/guard/goto-url-auth.guard';
import {VeriguideAssignmentDeadlineResolverService} from './veriguide-assignment-deadline-resolver.service';
import {VeriguideAssignmentDeadlineService} from './veriguide-assignment-deadline.service';
import {
  AssignmentDeadlineComponent,
  AssignmentDeadlineCreationFormComponent
} from './veriguide-assignment-deadline.components';

const routes: Routes = [
  {
    path: '',
    component: AssignmentDeadlineComponent,
    canActivate: [ GotoUrlAuthGuard ],
    resolve: {
      assignmentDeadlineResolverService: VeriguideAssignmentDeadlineResolverService
    }
  },
  {
    path: 'deadlineCreate',
    component: AssignmentDeadlineCreationFormComponent,
    canActivate: [ GotoUrlAuthGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    VeriguideAssignmentDeadlineService
  ]
})
export class VeriguideAssignmentDeadlineRoutingModule { }
