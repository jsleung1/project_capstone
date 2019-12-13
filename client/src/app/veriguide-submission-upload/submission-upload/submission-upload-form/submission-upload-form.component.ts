import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ViewRef
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {Subscription} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';

import {VeriguideSubmissionUploadService} from '../../veriguide-submission-upload.service';
import {MessageWithParamDTO, UploadSubmissionResultDTO} from '../../../veriguide-model/models';

@Component({
  selector: 'app-submission-upload-form',
  templateUrl: './submission-upload-form.component.html',
  styleUrls: ['./submission-upload-form.component.css', '../submission-upload.component.scss'],
})
export class SubmissionUploadFormComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private sUploadService: VeriguideSubmissionUploadService,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private spinner: NgxSpinnerService,
              private el: ElementRef) {
  }

  public fg: FormGroup;

  private objAlertMessages: MessageWithParamDTO;
  private isPageLoaded;
  private isBlockBackButton;
  private isBlockNextButton;
  private isSubmitNotAllowed;
  private sub1: Subscription;
  private sub2: Subscription;

  ngOnInit() {
    this.fg = this.fb.group({
      submissionTime: [null, Validators.nullValidator]
    });

    this.objAlertMessages = null;
    this.isPageLoaded = false;
    this.isBlockBackButton = false;
    this.isBlockNextButton = true;
    this.isSubmitNotAllowed = false;
    const fnValidCheck = (form: any) => { this.isBlockNextButton = !this.isFormValid(); };
    this.sub1 = this.fg.valueChanges.subscribe(fnValidCheck);
    this.sub2 = this.fg.statusChanges.subscribe(fnValidCheck);
  }

  ngAfterViewInit() {
    this.isPageLoaded = true;
  }

  ngOnDestroy() {
    this.fg.removeControl('submissionTime');
    this.disposeVars();
  }

  disposeVars() {
    this.objAlertMessages = null;
    this.isPageLoaded = false;
    this.isBlockNextButton = true;
    this.isBlockBackButton = true;
    this.isSubmitNotAllowed = false;
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

  private isFormValid(): boolean {
    if (this.isPageLoaded && !(this.cd as ViewRef).destroyed) {
      this.cd.detectChanges();    // enforce angular change detection (checking components again)
      return this.fg.valid;
    } else {
      return false;
    }
  }

  private onClickNext(event?: any): void {
    this.sUploadService.moveNextPhase();
    this.fg.updateValueAndValidity();
    if (event) { event.target.blur(); }
    if (!this.sUploadService.isStandbyToSubmit()) {
      event.preventDefault();
    }
    // else submit the data
  }

  private onClickBack(event?: any): void {
    this.sUploadService.movePreviousPhase();
    this.fg.updateValueAndValidity();
    if (event) { event.target.blur(); }
  }

  private onBlockUserSubmission(isBlocked: boolean): void {
    this.isSubmitNotAllowed = false;
    if (!this.sUploadService.isInAssignmentSelection()) { return; }
    this.isSubmitNotAllowed = isBlocked;
  }

  private onShowAlertBanner(objAlertMessage: MessageWithParamDTO): void {
    this.objAlertMessages = null;
    if (!this.sUploadService.isInAssignmentSelection()) {
      return;
    } else if (!objAlertMessage || !objAlertMessage.message) {
      return;
    }
    this.objAlertMessages = objAlertMessage;
  }

  private scrollToBottom(): void {
    const scrollingElement = (document.scrollingElement || document.body);
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
  }

  private onSubmitUploadForm(): void {
    this.spinner.show();
    this.sUploadService.setFormData( this.fg );
    this.sUploadService.postUploadSubmission().subscribe(
      (uploadSubmissionResultDTO: UploadSubmissionResultDTO) => {
        this.spinner.hide();
        const objSubmitted = this.fg.value;
        const objReceived = uploadSubmissionResultDTO;
        const isUploadSuccess = objReceived.isUploadSuccess;

        this.disposeVars();
        this.sUploadService.navigateToResultPage(isUploadSuccess, objSubmitted, objReceived);
      }
    );
  }
}
