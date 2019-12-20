import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchoolLoginComponent } from './school-login/school-login.component';
import { GotoUrlAuthGuard } from '../veriguide-user-service/guard/goto-url-auth.guard';
import { veriguideInjectors, URL_PATH_CONFIG } from '../veriguide-common-type/veriguide-injectors';
import { UserRegistrationComponent } from '../veriguide-common-ui/component/user-registration/user-registration.component';
import { Auth0ResolverService } from '../veriguide-user-service/auth0-resolver.service';
import { AuthenticationStateEnum } from '../veriguide-model/loggedInUser';

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
    // http://localhost:4200/school/auth0
    path: veriguideInjectors.get(URL_PATH_CONFIG).userAuth0CallBackPath.relativePath,
    // component: MainMenuComponent,
    resolve: {
      auth0ResolverService: Auth0ResolverService
    },
  },
  {
    path: veriguideInjectors.get(URL_PATH_CONFIG).userRegistrationPage.relativePath,
    component: UserRegistrationComponent
  },  
  {
    path: veriguideInjectors.get(URL_PATH_CONFIG).userMainPage.relativePath,
    loadChildren: () => import('../veriguide-main/veriguide-main.module').then(mod => mod.VeriguideMainModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VeriguideSchoolLoginRoutingModule { }
