import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GotoUrlAuthGuard } from '../veriguide-user-service/guard/goto-url-auth.guard';
import { LoadSubmissionsResolverService } from '../veriguide-user-service/resolver/load-submissions-resolver.service';
import { SubmissionsHistoryComponent } from '../common-ui/component/submissions-history/submissions-history.component';

const routes: Routes = [
  {
    path: '',
    component: SubmissionsHistoryComponent,
    canActivate: [ GotoUrlAuthGuard ],
    resolve: {
      resolverService: LoadSubmissionsResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerimarkerSubmissionHistoryRoutingModule { }
