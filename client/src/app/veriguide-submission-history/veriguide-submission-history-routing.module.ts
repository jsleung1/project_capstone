import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GotoUrlAuthGuard } from '../veriguide-user-service/guard/goto-url-auth.guard';
import { UserSubmissionHistoryResolverService } from './user-submission-history-resolver.service';
import { VeriguideGridComponent } from '../veriguide-common-ui/grid/veriguide-grid/veriguide-grid.component';

const routes: Routes = [
  {
    path: '',
    component: VeriguideGridComponent,
    canActivate: [ GotoUrlAuthGuard ],
    resolve: {
      userSubmissionHistoryResolverService: UserSubmissionHistoryResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VeriguideSubmissionHistoryRoutingModule { }
