import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserSubmissionsResolverService } from './user-submissions-resolver.service';
import { VeriguideGridComponent } from '../veriguide-common-ui/grid/veriguide-grid/veriguide-grid.component';
import { GotoUrlAuthGuard } from '../veriguide-user-service/guard/goto-url-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: VeriguideGridComponent,
    canActivate: [ GotoUrlAuthGuard ],
    resolve: {
      resolverService: UserSubmissionsResolverService
    }
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class VeriguideSubmissionsRoutingModule { }
