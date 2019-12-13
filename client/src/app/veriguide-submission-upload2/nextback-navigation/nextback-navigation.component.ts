import { Component, OnInit } from '@angular/core';
import { NextBackStackNavigationService } from './nextback-stack-navigation.service';

@Component({
  selector: 'app-nextback-bar',
  templateUrl: './nextback-navigation.component.html',
  styleUrls: ['./nextback-navigation.component.css']
})
export class NextbackNavigationComponent implements OnInit {

  constructor( private nextBackNavigationService: NextBackStackNavigationService ) {
  }

  ngOnInit() {
    this.nextBackNavigationService.first();
  }

  onClickBack($event: MouseEvent) {
    this.nextBackNavigationService.back();
  }

  onClickNext($event: MouseEvent) {

    this.nextBackNavigationService.next();
  }

}
