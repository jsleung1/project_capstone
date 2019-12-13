import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {VeriguideSubmissionUploadService} from '../../../veriguide-submission-upload.service';
import {StateComponent} from '../../../../veriguide-common-type/state-component';

@Component({
  selector: 'app-form-confirmation',
  templateUrl: './form-confirmation.component.html',
  styleUrls: ['./form-confirmation.component.css', '../../submission-upload.component.scss']
})
export class FormConfirmationComponent implements StateComponent, OnInit, OnDestroy, AfterViewInit {
  @Input() fg: FormGroup;

  constructor(private sUploadService: VeriguideSubmissionUploadService) {
  }

  ngOnInit() {
    this.fg.addControl('chkConfirmSubmission', new FormControl(false, Validators.required));
    this.sUploadService.currentState.subscribe((state) => {
      if (this.sUploadService.isInConfirmation()) {
        this.enterState();
      } else {
        this.leaveState();
      }
    });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy(): void {
    this.fg.removeControl('chkConfirmSubmission');
  }

  enterState(): void {
    this.initVars();
  }

  leaveState(): void {
  }

  initVars(): void {
    if (this.fg.get('chkConfirmSubmission')) { this.fg.get('chkConfirmSubmission').setValue(false); }
  }

  resetVars(): void {
  }
}
