import {Component, Input, OnInit, OnDestroy, AfterViewInit, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

import {NgbCalendar, NgbDate, NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import {StateComponent} from '../../../../veriguide-common-type/state-component';
import {VeriguideSubmissionUploadService} from '../../../veriguide-submission-upload.service';
import {CustomDatepickerI18n} from '../../../../veriguide-common-type/custom-datepicker';
import {
  AssignmentDeadLineDTO,
  AssignmentMarkerDTO,
  AssignmentNumberDTO,
  MessageWithParamDTO
} from '../../../../veriguide-model/models';
import * as fields from './form-assignment-information.fields';
import {AssignmentFileValidator} from '../form-validators/form-validators';

@Component({
  selector: 'app-form-assignment-information',
  templateUrl: './form-assignment-information.component.html',
  styleUrls: ['./form-assignment-information.component.css', '../../submission-upload.component.scss'],
  providers: [
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class FormAssignmentInformationComponent implements StateComponent, OnInit, OnDestroy, AfterViewInit {
  @Input() fg: FormGroup;
  @Output() blockUserSubmission: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showAlertBanner: EventEmitter<MessageWithParamDTO> = new EventEmitter<MessageWithParamDTO>();

  // Those values should be obtained from the server
  readonly fields = fields;

  private isBlockedUserSubmission = false;

  private assignmentMarkerDTOs: AssignmentMarkerDTO[] = [];
  private assignmentNumDTOs: AssignmentNumberDTO[] = [];

  private selectedAssignmentMarker: AssignmentMarkerDTO;
  private selectedAssignmentNum: AssignmentNumberDTO;
  private selectedAssignmentDeadLine: AssignmentDeadLineDTO;

  readonly defaultAssignmentFileMessage = 'assignmentUpload.inputFile.message';
  private currentAssignmentFileMessage = this.defaultAssignmentFileMessage;

  private dsDatepicker: NgbDateStruct;
  private isDisableDatepicker;
  private ndToday: NgbDate;
  private ndMax: NgbDate;
  private ndMin: NgbDate;

  constructor(private sUploadService: VeriguideSubmissionUploadService,
              private calender: NgbCalendar) {
  }

  ngOnInit() {
    Object.entries(fields.namesFieldItems).forEach(([key, value]) => {
      this.fg.addControl(value as string, new FormControl(fields.dValueFieldItems[key], Validators.compose(fields.validatorsFieldItems[key])));
    });

    this.sUploadService.currentState.subscribe((state) => {
      if (this.sUploadService.isInAssignmentSelection()) {
        this.enterState();
      } else if (this.sUploadService.isInCourseSelection()) {
        this.resetVars();
      } else {
        this.leaveState();
      }
    });

    this.fg.get(fields.namesFieldItems.aMarker).valueChanges.subscribe( selectedAssignmentMarker => {
      if ( !selectedAssignmentMarker ) { return; }
      this.selectedAssignmentMarker = selectedAssignmentMarker;
      this.sUploadService.getAssignmentNumbers( this.selectedAssignmentMarker.primaryLoginId ).subscribe( assignmentNumDTOs => {
          this.assignmentNumDTOs = assignmentNumDTOs;
          this.selectedAssignmentNum = null;
          this.fg.get(fields.namesFieldItems.aNum).setValue(this.selectedAssignmentNum);
        }
      );
    });

    this.fg.get(fields.namesFieldItems.aNum).valueChanges.subscribe( selectedAssignmentNumber => {
      if ( !this.selectedAssignmentMarker || !selectedAssignmentNumber ) { return; }
      this.selectedAssignmentNum = selectedAssignmentNumber;
      this.sUploadService.getAssignmentDeadLine( this.selectedAssignmentMarker.primaryLoginId, this.selectedAssignmentNum.assignment_number ).subscribe( assignmentDeadLineDTOs => {
        if ( assignmentDeadLineDTOs.length > 0) {
          this.selectedAssignmentDeadLine = assignmentDeadLineDTOs[0];
          this.setDatepicker();  // set the calender and the field value
        }
      });
    });

    this.blockUserSubmission.subscribe(isBlocked => { this.isBlockedUserSubmission = isBlocked; });

    this.initVars();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy() {
    Object.entries(fields.namesFieldItems).forEach(([key, value]) => {
      this.fg.removeControl(value as string);
    });
  }

  enterState(): void {
    if (this.isItemsAllFilled()) { return; }
    this.initVars();
    this.sUploadService.getAssignmentMarkers().subscribe(assignmentMarkerDTOs => {
      this.assignmentMarkerDTOs = assignmentMarkerDTOs;
      this.selectedAssignmentMarker = null;
      this.fg.get(fields.namesFieldItems.aMarker).setValue(this.selectedAssignmentMarker);
    });
  }

  leaveState(): void {
  }

  initVars() {
    this.resetVars();
  }

  resetVars(): void {
    this.isBlockedUserSubmission = false;

    this.assignmentMarkerDTOs = [];
    this.assignmentNumDTOs = [];

    this.selectedAssignmentMarker = null;
    this.selectedAssignmentNum = null;
    this.selectedAssignmentDeadLine = null;
    this.currentAssignmentFileMessage = '';

    Object.entries(fields.namesFieldItems).forEach(([key, value]) => {
      if (this.fg.get(value as string)) { this.fg.get(value as string).setValue(fields.dValueFieldItems[key]); }
    });

    this.setDatepicker();
  }

  private isItemsAllFilled(): boolean {
    let isAllFilled = true;
    Object.entries(fields.namesFieldItems).forEach(([key, value]) => {
      if (!(this.fg.get(value as string) && this.fg.get(value as string).value)) {
        isAllFilled = false;
        return;
      }
    });
    return isAllFilled;
  }

  private setDatepicker() {
    if (!this.fg.get(fields.namesFieldItems.aDl)) { return; }
    // default settings
    const numMinMonth = 1;
    const numMaxMonth = 5;
    this.ndToday = this.calender.getToday();
    this.ndMin = this.calender.getPrev(this.ndToday, 'm', numMinMonth);
    this.ndMax = this.calender.getNext(this.ndToday, 'm', numMaxMonth);

    let isDisabledCalender = false;
    let isBlockSubmission = false;
    let ndDefault: NgbDate = null;
    let arrValidators: ValidatorFn[];

    if (this.selectedAssignmentDeadLine) {
      if (this.selectedAssignmentDeadLine.assignmentDeadLineExist) {
        ndDefault = this.sUploadService.getNgbDateFromString(this.selectedAssignmentDeadLine.dueDate);
        isDisabledCalender = true;
        if (!this.selectedAssignmentDeadLine.canUserUploadSubmission) {
          isBlockSubmission = true;
        }
      } else {
        ndDefault = this.ndToday;
        isDisabledCalender = false;
      }
    }

    arrValidators = !isDisabledCalender ? fields.validatorsFieldItems.aDl : [Validators.nullValidator];
    this.dsDatepicker = ndDefault;
    this.isDisableDatepicker = isDisabledCalender;
    this.fg.get(fields.namesFieldItems.aDl).setValidators(Validators.compose(arrValidators));
    this.blockUserSubmission.emit(isBlockSubmission);
  }

  private isDisplayErrorInField(fieldname: string): boolean {
    return Boolean(this.sUploadService.isCourseSelected() &&
                  this.fg.get(fieldname).hasError('required') &&
                  !this.isBlockedUserSubmission);
  }

  private onChangeFileValue(event: any) {
    // display filename
    const pathFile = event.target.value ? event.target.value : null;
    this.currentAssignmentFileMessage = pathFile ? this.sUploadService.getSizedBasename(pathFile, 30) : this.defaultAssignmentFileMessage;
    // file data
    const dataFile = event.target.files.length > 0 ? event.target.files[0] : null;
    this.fg.get(fields.namesFieldItems.aFileD).setValue(dataFile);
  }

  private onChangeFileData(file: File) {
    // validation checking
    let objAlertMessage: MessageWithParamDTO;
    let strAlertMessage = '';
    let paramAlertMessage = null;
    this.fg.get(fields.namesFieldItems.aFileD).updateValueAndValidity();
    if (this.fg.get(fields.namesFieldItems.aFileD).hasError('isFileOversize')) {
      strAlertMessage = fields.validationMessagesFieldItems.aFileD.isFileOversize;
      paramAlertMessage = {0: AssignmentFileValidator.maxFileSizeMB};
    } else {
      strAlertMessage = '';
      paramAlertMessage = null;
    }
    objAlertMessage = {message: strAlertMessage, param: paramAlertMessage};
    this.showAlertBanner.emit(objAlertMessage);
  }
}
