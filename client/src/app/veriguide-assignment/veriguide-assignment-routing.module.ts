import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GotoUrlAuthGuard } from '../veriguide-common-type/guard/goto-url-auth.guard';
import { veriguideInjectors, URL_PATH_CONFIG } from '../veriguide-common-type/veriguide-injectors';
import { UserAssignmentResolverService } from './user-assignment-resolver.service';
import { VeriguideAssignmentInfoComponent } from './veriguide-assignment-info/veriguide-assignment-info.component';

const routes: Routes = [
  {
    path: '',
    component: VeriguideAssignmentInfoComponent,
    canActivate: [ GotoUrlAuthGuard ],
    resolve: {
      userResolverService: UserAssignmentResolverService
    }
  },
  {
    path: veriguideInjectors.get(URL_PATH_CONFIG).userSubmissions.fullPath, // // actually it is a relative path, but full path for a submodule (submissions module)
    loadChildren: () => import('../veriguide-submissions/veriguide-submissions.module').then(mod => mod.VeriguideSubmissionsModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class VeriguideAssignmentRoutingModule { }
