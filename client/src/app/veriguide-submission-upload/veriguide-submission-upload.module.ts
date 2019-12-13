import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { HttpLoaderFactory } from '../veriguide-common-type/common-factory';
import { VeriguideSubmissionUploadRoutingModule } from './veriguide-submission-upload-routing.module';
import { VeriguideCommonUiModule } from '../veriguide-common-ui/veriguide-common-ui.module';

import {
  SubmissionUploadFormComponent,
  SubmissionUploadInformationComponent,
  FormCourseInformationComponent,
  FormAssignmentInformationComponent,
  SubmissionUploadComponent,
  FormConfirmationComponent,
  FormAgreementComponent,
  FormAgreementCUHKComponent,
  FormAgreementOthersComponent,
  SubmissionUploadSuccessComponent,
  SubmissionUploadFailedComponent,
  VeriguideSubmissionUploadService
} from './veriguide-submission-upload.components';
import { VeriguideSubmissionUploadGuards } from './veriguide-submission-upload.guards';
@NgModule({
  declarations: [
    SubmissionUploadFormComponent,
    SubmissionUploadInformationComponent,
    FormCourseInformationComponent,
    FormAssignmentInformationComponent,
    SubmissionUploadComponent,
    FormConfirmationComponent,
    FormAgreementComponent,
    FormAgreementCUHKComponent,
    FormAgreementOthersComponent,
    SubmissionUploadSuccessComponent,
    SubmissionUploadFailedComponent
  ],
  providers: [
    VeriguideSubmissionUploadService,
    VeriguideSubmissionUploadGuards
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    VeriguideSubmissionUploadRoutingModule,
    VeriguideCommonUiModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class VeriguideSubmissionUploadModule { }
