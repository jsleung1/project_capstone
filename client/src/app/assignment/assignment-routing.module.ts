import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GotoUrlAuthGuard } from '../veriguide-user-service/guard/goto-url-auth.guard';
import { veriguideInjectors, URL_PATH_CONFIG } from '../veriguide-common-type/veriguide-injectors';
import { LoadAssignmentsResolverService } from '../veriguide-user-service/resolver/load-assignments-resolver.service';
import { VeriguideAssignmentInfoComponent } from './assignment-info/veriguide-assignment-info.component';
import { CreateAssignmentComponent } from './create-assignment/create-assignment.component';
import { LoadCourseResolverService } from '../veriguide-user-service/resolver/load-course-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: VeriguideAssignmentInfoComponent,
    canActivate: [ GotoUrlAuthGuard ],
    resolve: {
      resolverService: LoadAssignmentsResolverService
    }
  },
  {
    path: veriguideInjectors.get(URL_PATH_CONFIG).userCreateAssignment.relativePath,
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
export class VeriguideAssignmentRoutingModule { }
