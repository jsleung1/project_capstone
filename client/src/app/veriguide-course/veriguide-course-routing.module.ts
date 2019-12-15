
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserCourseResolverService } from './user-course-resolver.service';
import { GotoUrlAuthGuard } from '../veriguide-common-type/guard/goto-url-auth.guard';
import { veriguideInjectors, URL_PATH_CONFIG } from '../veriguide-common-type/veriguide-injectors';
import { VeriguideCourseInfoComponent } from '../veriguide-common-ui/common-ui';
import { CreateCourseComponent } from './create-course/create-course.component';

const routes: Routes = [
  {
    path: '',
    component: VeriguideCourseInfoComponent,
    canActivate: [ GotoUrlAuthGuard ],
    resolve: {
      userResolverService: UserCourseResolverService
    }
  },
  {
    path: veriguideInjectors.get(URL_PATH_CONFIG).userCreateCourse.relativePath,
    component: CreateCourseComponent,
    canActivate: [ GotoUrlAuthGuard ]
  },
  {
    path: veriguideInjectors.get(URL_PATH_CONFIG).userAssignments.fullPath, // actually it is a relative path, but full path for a submodule (assignment module)
    loadChildren: () => import('../veriguide-assignment/veriguide-assignment.module').then(mod => mod.VeriguideAssignmentModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class VeriguideCourseRoutingModule { }
