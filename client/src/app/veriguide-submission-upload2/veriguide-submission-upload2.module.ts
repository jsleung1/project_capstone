import { AssignmentUploadComponent } from './assignment-upload/assignment-upload.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VeriguideSubmissionUpload2RoutingModule } from './veriguide-submission-upload2-routing.module';
import { VerimarkerCommonUiModule } from '../common-ui/verimarker-common-ui.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    VeriguideSubmissionUpload2RoutingModule,
    VerimarkerCommonUiModule
  ],
  // dynamic components:
  entryComponents: [
    AssignmentUploadComponent
  ],
  declarations: [
    AssignmentUploadComponent,
  ],
})
export class VeriguideSubmissionUpload2Module { }
