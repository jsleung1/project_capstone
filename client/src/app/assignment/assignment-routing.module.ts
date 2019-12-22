import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GotoUrlAuthGuard } from '../veriguide-user-service/guard/goto-url-auth.guard';
import { verimarkerInjectors, URL_PATH_CONFIG } from '../common-type/verimarker-injectors';
import { LoadAssignmentsResolverService } from '../veriguide-user-service/resolver/load-assignments-resolver.service';
import { AssignmentInfoComponent } from './assignment-info/assignment-info.component';
import { CreateAssignmentComponent } from './create-assignment/create-assignment.component';
import { LoadCourseResolverService } from '../veriguide-user-service/resolver/load-course-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: AssignmentInfoComponent,
    canActivate: [ GotoUrlAuthGuard ],
    resolve: {
      resolverService: LoadAssignmentsResolverService
    }
  },
  {
    path: verimarkerInjectors.get(URL_PATH_CONFIG).userCreateAssignment.relativePath,
    component: CreateAssignmentComponent,
    canActivate: [ GotoUrlAuthGuard ],
    resolve: {
      resolverService: LoadCourseResolverService
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class VerimarkerAssignmentRoutingModule { }
