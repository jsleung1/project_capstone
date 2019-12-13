import {Component, Input, OnInit, OnDestroy, AfterViewInit, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

import {NgbCalendar, NgbDate, NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import {StateComponent} from '../../../../veriguide-common-type/state-component';
import {VeriguideAssignmentDeadlineService} from '../../../veriguide-assignment-deadline.service';
import {CustomDatepickerI18n} from '../../../../veriguide-common-type/custom-datepicker';
import {AssignmentNumberDTO, SystemParam} from '../../../../veriguide-model/models';
import * as fields from './form-assignment-details.fields';

@Component({
  selector: 'app-form-assignment-details',
  templateUrl: './form-assignment-details.component.html',
  styleUrls: ['./form-assignment-details.component.scss', '../../assignment-deadline.component.scss'],
  providers: [
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class FormAssignmentDetailsComponent implements StateComponent, OnInit, OnDestroy, AfterViewInit {
  @Input() fg: FormGroup;

  // Those values should be obtained from the server
  readonly fields = fields;

  private assignmentNumDTOs: AssignmentNumberDTO[] = [];
  private assignmentAllowDTOs: SystemParam[] = [];

  private selectedAssignmentNum: AssignmentNumberDTO;
  private selectedAssignmentAllow: boolean;

  private dsDatepicker: NgbDateStruct;
  private ndToday: NgbDate;
  private ndMax: NgbDate;
  private ndMin: NgbDate;

  constructor(private sAsgnDeadline: VeriguideAssignmentDeadlineService,
              private calender: NgbCalendar) {
  }

  ngOnInit() {
    Object.entries(fields.namesFieldItems).forEach(([key, value]) => {
      this.fg.addControl(value as string, new FormControl(fields.dValueFieldItems[key], Validators.compose(fields.validatorsFieldItems[key])));
    });

    this.sAsgnDeadline.currentState.subscribe((state) => {
      if (this.sAsgnDeadline.isInAssignmentDetailInCreation()) {
        this.enterState();
      } else if (this.sAsgnDeadline.isInCourseSelectInCreation()) {
        this.resetVars();
      } else {
        this.leaveState();
      }
    });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    Object.entries(fields.namesFieldItems).forEach(([key, value]) => {
      this.fg.removeControl(value as string);
    });
  }

  enterState() {
    this.resetVars();
    this.initVars();
  }

  leaveState() {
  }

  initVars() {
    this.assignmentNumDTOs = fields.valuesFieldItems.aNum;
    this.assignmentAllowDTOs = fields.valuesFieldItems.aAllow;
    Object.entries(fields.namesFieldItems).forEach(([key, value]) => {
      if (this.fg.get(value as string)) { this.fg.get(value as string).setValue(fields.dValueFieldItems[key]); }
    });
  }

  resetVars() {
    this.assignmentNumDTOs = [];
    this.assignmentAllowDTOs = [];

    this.selectedAssignmentNum = null;
    this.selectedAssignmentAllow = null;

    this.resetDatepicker();
  }

  private resetDatepicker() {
    if (!this.fg.get(fields.namesFieldItems.aDl)) { return; }
    // default settings
    const numMinMonth = 1;
    const numMaxMonth = 5;
    this.ndToday = this.calender.getToday();
    this.ndMin = this.calender.getPrev(this.ndToday, 'm', numMinMonth);
    this.ndMax = this.calender.getNext(this.ndToday, 'm', numMaxMonth);

    // this.dsDatepicker = this.ndToday;
  }

  private isDisplayErrorInField(fieldname: string): boolean {
    return Boolean(this.sAsgnDeadline.isCourseSelectedInCreation() &&
      this.fg.get(fieldname).hasError('required'));
  }

}
