import { AssignmentUploadComponent } from './assignment-upload/assignment-upload.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerimarkerSubmissionUpload2RoutingModule } from './verimarker-submission-upload-routing.module';
import { VerimarkerCommonUiModule } from '../common-ui/verimarker-common-ui.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    VerimarkerSubmissionUpload2RoutingModule,
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
export class VerimarkerSubmissionUpload2Module { }
