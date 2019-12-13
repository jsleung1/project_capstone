import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';

import {VeriguideSubmissionUploadService} from '../veriguide-submission-upload.service';

@Component({
  selector: 'app-submission-upload',
  templateUrl: './submission-upload.component.html',
  styleUrls: ['./submission-upload.component.scss']
})
export class SubmissionUploadComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private sUploadService: VeriguideSubmissionUploadService) {
  }

  ngOnInit() {
    this.sUploadService.reset();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    // no need to reset the service when leaving to store the previous submission result
  }
}
