import { Component, OnInit } from '@angular/core';

import {VeriguideSubmissionUploadService} from '../../veriguide-submission-upload.service';

@Component({
  selector: 'app-submission-upload-information',
  templateUrl: './submission-upload-information.component.html',
  styleUrls: ['./submission-upload-information.component.css', '../submission-upload.component.scss']
})
export class SubmissionUploadInformationComponent implements OnInit {

  constructor(private sUploadService: VeriguideSubmissionUploadService) {
  }

  ngOnInit() {
  }
}
