import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GotoUrlAuthGuard } from '../veriguide-common-type/guard/goto-url-auth.guard';
import { veriguideInjectors, URL_PATH_CONFIG } from '../veriguide-common-type/veriguide-injectors';
import { MainMenuComponent } from '../veriguide-common-ui/common-ui';
import { Auth0ResolverService } from '../veriguide-user-service/auth0-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: MainMenuComponent,
    canActivate: [ GotoUrlAuthGuard ]
  },
  {
    // https://lms.veriguide.org:4400/school/main/auth0
    path: 'auth0',
    component: MainMenuComponent,
    resolve: {
      auth0ResolverService: Auth0ResolverService
    },
  },
  {
    path: 'assignmentDeadline',
    loadChildren: () => import('../veriguide-assignment-deadline/veriguide-assignment-deadline.module').then(mod => mod.VeriguideAssignmentDeadlineModule)
  },
  {
    path: 'submissionHistory',
    loadChildren: () => import('../veriguide-submission-history/veriguide-submission-history.module').then(mod => mod.VeriguideSubmissionHistoryModule)
  },
  {
    path: veriguideInjectors.get(URL_PATH_CONFIG).userSubmissionUploadMain.relativePath,
    loadChildren: () => import('../veriguide-submission-upload2/veriguide-submission-upload2.module').then(mod => mod.VeriguideSubmissionUpload2Module)
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class VeriguideMainRoutingModule { }
