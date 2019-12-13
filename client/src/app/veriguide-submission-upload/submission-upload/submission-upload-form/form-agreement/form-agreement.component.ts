import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {VeriguideSubmissionUploadService} from '../../../veriguide-submission-upload.service';
import {StateComponent} from '../../../../veriguide-common-type/state-component';

@Component({
  selector: 'app-form-agreement',
  templateUrl: './form-agreement.component.html',
  styleUrls: ['./form-agreement.component.css', '../../submission-upload.component.scss']
})
export class FormAgreementComponent implements StateComponent, OnInit, OnDestroy, AfterViewInit {
  @Input() fg: FormGroup;

  constructor(private sUploadService: VeriguideSubmissionUploadService) {
  }

  ngOnInit() {
    this.fg.addControl('chkConfirmAgreement', new FormControl(false, Validators.required));
    this.sUploadService.currentState.subscribe((state) => {
      if (this.sUploadService.isInConfirmation()) {
        this.enterState();
      } else {
        this.leaveState();
      }
    });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.fg.removeControl('chkConfirmAgreement');
  }

  enterState(): void {
    this.initVars();
  }

  leaveState(): void {
  }

  initVars(): void {
    if (this.fg.get('chkConfirmAgreement')) { this.fg.get('chkConfirmAgreement').setValue(false); }
  }

  resetVars(): void {
  }
}
