import { AuthenticationStateEnum } from './veriguide-model/server-model/loggedInUser';
import { TopMenuItem } from './veriguide-common-type/top-menu-item';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import { LoggedInUser } from './veriguide-model/models';

import { UrlPathConfig } from './veriguide-common-type/url-path-config';
import { veriguideInjectors, URL_PATH_CONFIG } from './veriguide-common-type/veriguide-injectors';
import { TranslateService } from '@ngx-translate/core';
import { MenuBuilderService } from './veriguide-user-service/menu-builder-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Auth0Service } from './veriguide-user-service/auth0.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private title = 'VeriGuide 2.0';
  private topMenuItems: TopMenuItem[] = new Array();

  private loggedInUser: LoggedInUser = { authenticationState: AuthenticationStateEnum.NeedToLogin };

  private urlPathConfig: UrlPathConfig;

  constructor( private router: Router,
               private translate: TranslateService,
               private auth0Service: Auth0Service,
               private menuBuilder: MenuBuilderService,
               private spinner: NgxSpinnerService  ) {

    this.urlPathConfig = veriguideInjectors.get(URL_PATH_CONFIG);

    this.menuBuilder.getUserMenuContainer().subscribe( userMenuContainer => {
      this.loggedInUser = userMenuContainer.loggedInUser;
      this.topMenuItems = userMenuContainer.topMenuItems;
    });

    translate.addLangs(['en', 'zh_Hant', 'zh_Hans' ]);
    translate.setDefaultLang('en');
    translate.use('en');

    router.events.subscribe ( event => {
      if ( event instanceof NavigationStart) {
        this.spinner.show();
      }

      if ( event instanceof NavigationEnd
        || event instanceof NavigationCancel
        || event instanceof NavigationError ) {
        this.spinner.hide();
      }
    });
  }

  navigatePage(menuItem: TopMenuItem) {
  }

  ngOnInit() {
    /*
    this.translate.get('HOME').subscribe(
      translations => {
        console.log( translations);
      }
    );
    */
  }

  private isAuthenticated(): boolean {
    return this.loggedInUser.authenticationState === AuthenticationStateEnum.Authenticated;
  }

  private logout(): void {
    this.auth0Service.logout();
  }

  private onClickTranslate(lang: string) {
    this.translate.use(lang);
  }

}
