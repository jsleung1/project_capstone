import { Component, OnInit } from '@angular/core';
import { ContentMenuItem } from '../../../veriguide-common-type/content-menu-item';
import { MenuBuilderService } from '../../../veriguide-user-service/menu-builder-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-main',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  contentMenuItems: ContentMenuItem[] = new Array();

  constructor( private menuBuilderService: MenuBuilderService,
               private route: ActivatedRoute  ) {

    route.data.subscribe( s => {

      this.menuBuilderService.getUserMenuContainer().subscribe( userMenuContainer => {
          this.contentMenuItems = userMenuContainer.contentMenuItems;
      });
    });
  }

  ngOnInit() {
  }

}
