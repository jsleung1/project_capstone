import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewRef} from '@angular/core';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {Subscription} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';

import {MessageWithParamDTO} from '../../../veriguide-model/models';

@Component({
  selector: 'app-assignment-deadline-creation-form',
  templateUrl: './assignment-deadline-creation-form.component.html',
  styleUrls: ['./assignment-deadline-creation-form.component.scss', '../assignment-deadline.component.scss']
})
export class AssignmentDeadlineCreationFormComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private spinner: NgxSpinnerService,
              private el: ElementRef,
              private location: Location) {
  }

  public fg: FormGroup;

  private objAlertMessages: MessageWithParamDTO;
  private isPageLoaded;
  private isBlockBackButton;
  private isBlockSubmitButton;
  private sub1: Subscription;
  private sub2: Subscription;

  ngOnInit() {
    this.fg = this.fb.group({
      submissionTime: [null, Validators.nullValidator]
    });

    this.objAlertMessages = null;
    this.isPageLoaded = false;
    this.isBlockBackButton = false;
    this.isBlockSubmitButton = true;
    const fnValidCheck = (form: any) => { this.isBlockSubmitButton = !this.isFormValid(); };
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
    this.isBlockSubmitButton = true;
    this.isBlockBackButton = true;
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

  private isFormValid(): boolean {
    if (this.isPageLoaded && !(this.cd as ViewRef).destroyed) {
      this.cd.detectChanges();
      return this.fg.valid;
    } else {
      return false;
    }
  }

  onClickBack($event: MouseEvent) {
    this.location.back();
  }

  onSubmitDeadlineCreationForm() {
    // REST API POST CREATION FORM DATA
    this.location.go('../');
  }
}
