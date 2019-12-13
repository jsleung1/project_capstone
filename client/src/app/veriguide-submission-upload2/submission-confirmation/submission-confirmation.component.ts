import { Component, OnInit } from '@angular/core';
import { DynamicComponent } from '../dynamic-component';
import { DynamicComponentInfo } from '../nextback-navigation/dynamic-component-info';

@Component({
  selector: 'app-submission-confirmation',
  templateUrl: './submission-confirmation.component.html',
  styleUrls: ['./submission-confirmation.component.css']
})
export class SubmissionConfirmationComponent implements OnInit, DynamicComponent {

  dynamicComponentInfo: DynamicComponentInfo;

  constructor() { }

  ngOnInit() {
  }

  OnNotify(eventName: string, dynamicComponentInfo: DynamicComponentInfo ) {
    console.log('SubmissionConfirmationComponent.eventName: ' + eventName );
  }
}
