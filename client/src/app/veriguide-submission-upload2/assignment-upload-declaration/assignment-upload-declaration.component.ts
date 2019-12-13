import { Component, OnInit } from '@angular/core';
import { DynamicComponent } from '../dynamic-component';
import { DynamicComponentInfo } from '../nextback-navigation/dynamic-component-info';

@Component({
  selector: 'app-assignment-upload-declaration',
  templateUrl: './assignment-upload-declaration.component.html',
  styleUrls: ['./assignment-upload-declaration.component.css']
})
export class AssignmentUploadDeclarationComponent implements OnInit, DynamicComponent {

  dynamicComponentInfo: DynamicComponentInfo;

  constructor() { }

  ngOnInit() {
  }

  OnNotify(eventName: string, dynamicComponentInfo: DynamicComponentInfo ) {
    console.log('AssignmentUploadDeclarationComponent.eventName: ' + eventName );
  }
}
