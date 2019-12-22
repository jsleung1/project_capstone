import { AuthenticationStateEnum, LoggedInUser } from './model/loggedInUser';
import { TopMenuItem } from './common-type/top-menu-item';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';

import { UrlPathConfig } from './common-type/url-path-config';
import { verimarkerInjectors, URL_PATH_CONFIG } from './common-type/verimarker-injectors';
import { MenuBuilderService } from './user-service/menu-builder-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Auth0Service } from './user-service/auth0.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private title = 'VeriMarker';
  private topMenuItems: TopMenuItem[] = new Array();

  private loggedInUser: LoggedInUser = { authenticationState: AuthenticationStateEnum.NeedToLogin };

  private urlPathConfig: UrlPathConfig;

  constructor( private router: Router,
               private auth0Service: Auth0Service,
               private menuBuilder: MenuBuilderService,
               private spinner: NgxSpinnerService  ) {

    this.urlPathConfig = verimarkerInjectors.get(URL_PATH_CONFIG);

    this.menuBuilder.getUserMenuContainer().subscribe( userMenuContainer => {
      this.loggedInUser = userMenuContainer.loggedInUser;
      this.topMenuItems = userMenuContainer.topMenuItems;
    });
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
  }

  private isAuthenticated(): boolean {
    return this.loggedInUser.authenticationState === AuthenticationStateEnum.Authenticated;
  }

  private logout(): void {
    this.auth0Service.logout();
  }

}
