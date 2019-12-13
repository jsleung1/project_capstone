import { Component, OnInit, Input } from '@angular/core';
import {NgbCalendar, NgbDate, NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {CustomDatepickerI18n} from '../../veriguide-common-type/custom-datepicker';
import { DynamicComponent } from '../dynamic-component';
import { DynamicComponentInfo } from '../nextback-navigation/dynamic-component-info';

@Component({
  selector: 'app-assignment-upload',
  templateUrl: './assignment-upload.component.html',
  styleUrls: ['./assignment-upload.component.scss'],
  providers: [
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class AssignmentUploadComponent implements DynamicComponent {

  dynamicComponentInfo: DynamicComponentInfo;
  testValue = '12345';

  constructor() { }

  OnNotify(eventName: string, dynamicComponentInfo: DynamicComponentInfo ) {
    console.log('AssignmentUploadComponent.eventName: ' + eventName );
  }
}
