
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NextBackStackNavigationService } from '../nextback-navigation/nextback-stack-navigation.service';
import { DynamicContainerComponent } from '../dynamic-component-container/dynamic-container.component';

@Component({
  selector: 'app-submission-upload-main',
  templateUrl: './submission-upload-main.component.html',
  styleUrls: ['./submission-upload-main.component.scss']
})
export class SubmissionUploadMainComponent implements OnInit {

  @ViewChild(DynamicContainerComponent, { static: true }) verticalStackElement: DynamicContainerComponent;

  constructor( private route: ActivatedRoute,
               private nextBackNavigationService: NextBackStackNavigationService ) {
    route.data.subscribe( data => {
      this.nextBackNavigationService.setDynamicComponentInfos( data.nextBackNavigationComponentInfo );
    });
  }

  ngOnInit() {
    this.nextBackNavigationService.setDynamicContainerComponent( this.verticalStackElement );
  }

}
