import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchoolLoginComponent } from './school-login/school-login.component';
import { GotoUrlAuthGuard } from '../veriguide-user-service/guard/goto-url-auth.guard';
import { verimarkerInjectors, URL_PATH_CONFIG } from '../common-type/verimarker-injectors';
import { UserRegistrationComponent } from '../common-ui/component/user-registration/user-registration.component';
import { Auth0ResolverService } from '../veriguide-user-service/auth0-resolver.service';
import { AuthenticationStateEnum } from '../model/loggedInUser';

const routes: Routes = [
  {
    path: '',
    component: SchoolLoginComponent,
    canActivate: [ GotoUrlAuthGuard ],
    data: {
      authGuardOptions: {
        authConds: [ AuthenticationStateEnum.Authenticated ],
        authCondProceedOrigLink: false,
        authCondRedirectUrl: verimarkerInjectors.get(URL_PATH_CONFIG).userMainPage.fullPath,
      }
    },
  },
  {
    // http://localhost:4200/school/auth0
    path: verimarkerInjectors.get(URL_PATH_CONFIG).userAuth0CallBackPath.relativePath,
    // component: MainMenuComponent,
    resolve: {
      auth0ResolverService: Auth0ResolverService
    },
  },
  {
    path: verimarkerInjectors.get(URL_PATH_CONFIG).userRegistrationPage.relativePath,
    component: UserRegistrationComponent
  },  
  {
    path: verimarkerInjectors.get(URL_PATH_CONFIG).userMainPage.relativePath,
    loadChildren: () => import('../main/verimarker-main.module').then(mod => mod.VerimarkerMainModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VeriguideSchoolLoginRoutingModule { }
