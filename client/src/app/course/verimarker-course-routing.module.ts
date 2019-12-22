
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoadCoursesResolverService } from '../veriguide-user-service/resolver/load-courses-resolver.service';
import { GotoUrlAuthGuard } from '../veriguide-user-service/guard/goto-url-auth.guard';
import { verimarkerInjectors, URL_PATH_CONFIG } from '../common-type/verimarker-injectors';
import { CourseInfoComponent } from '../common-ui/common-ui';
import { CreateCourseComponent } from './create-course/create-course.component';

const routes: Routes = [
  {
    path: '',
    component: CourseInfoComponent,
    canActivate: [ GotoUrlAuthGuard ],
    resolve: {
      resolverService: LoadCoursesResolverService
    }
  },
  {
    path: verimarkerInjectors.get(URL_PATH_CONFIG).userCreateCourse.relativePath,
    component: CreateCourseComponent,
    canActivate: [ GotoUrlAuthGuard ]
  },
  {
    path: verimarkerInjectors.get(URL_PATH_CONFIG).userAssignments.fullPath, // actually it is a relative path, but full path for a submodule (assignment module)
    loadChildren: () => import('../assignment/assignment.module').then(mod => mod.VerimarkerAssignmentModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class VerimarkerCourseRoutingModule { }
