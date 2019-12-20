import { AssignmentUploadComponent } from './assignment-upload/assignment-upload.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VeriguideSubmissionUpload2RoutingModule } from './veriguide-submission-upload2-routing.module';
import { VeriguideCommonUiModule } from '../veriguide-common-ui/veriguide-common-ui.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../veriguide-common-type/common-factory';
import { HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    VeriguideSubmissionUpload2RoutingModule,
    VeriguideCommonUiModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
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
