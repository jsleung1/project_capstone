import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';

import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import {VeriguideSubmissionUploadService} from '../veriguide-submission-upload.service';
import {UploadSubmissionResultDTO} from '../../veriguide-model/models';

@Component({
  selector: 'app-submission-upload-success',
  templateUrl: './submission-upload-success.component.html',
  styleUrls: ['./submission-upload-success.component.scss']
})
export class SubmissionUploadSuccessComponent implements OnInit, OnDestroy, AfterViewInit {

  private objSubmitted: any = {};
  private objReceived: UploadSubmissionResultDTO = {};

  constructor(private sUploadService: VeriguideSubmissionUploadService,
              private pfDate: NgbDateParserFormatter) {
  }

  ngOnInit() {
    this.initVars();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

  initVars(): void {
    this.objSubmitted = this.sUploadService.objSubmitted || {};
    this.objReceived = this.sUploadService.objReceived || {};
  }
}
