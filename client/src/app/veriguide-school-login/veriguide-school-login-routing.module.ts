import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchoolLoginComponent } from './school-login/school-login.component';
import { GotoUrlAuthGuard } from '../veriguide-common-type/guard/goto-url-auth.guard';
import { AuthenticationStateEnum } from '../veriguide-model/models';
import { veriguideInjectors, URL_PATH_CONFIG } from '../veriguide-common-type/veriguide-injectors';

const routes: Routes = [
  {
    path: '',
    component: SchoolLoginComponent,
    canActivate: [ GotoUrlAuthGuard ],
    data: {
      authGuardOptions: {
        authConds: [ AuthenticationStateEnum.Authenticated ],
        authCondProceedOrigLink: false,
        authCondRedirectUrl: veriguideInjectors.get(URL_PATH_CONFIG).userMainPage.fullPath,
      }
    },
  },
  {
    path: 'main',
    loadChildren: () => import('../veriguide-main/veriguide-main.module').then(mod => mod.VeriguideMainModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VeriguideSchoolLoginRoutingModule { }
