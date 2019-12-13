import { AssignmentUploadComponent } from './assignment-upload/assignment-upload.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VeriguideSubmissionUpload2RoutingModule } from './veriguide-submission-upload2-routing.module';
import { SubmissionUploadMainComponent } from './submission-upload-main/submission-upload-main.component';
import { VeriguideCommonUiModule } from '../veriguide-common-ui/veriguide-common-ui.module';
import { NextbackNavigationComponent } from './nextback-navigation/nextback-navigation.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../veriguide-common-type/common-factory';
import { HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AssignmentUploadDeclarationComponent } from './assignment-upload-declaration/assignment-upload-declaration.component';
import { DynamicContainerComponent } from './dynamic-component-container/dynamic-container.component';
import { DynamicComponentDirective } from './dynamic-component-container/dynamic-component.directive';
import { SubmissionConfirmationComponent } from './submission-confirmation/submission-confirmation.component';

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
    SubmissionUploadMainComponent,
    DynamicContainerComponent,
    AssignmentUploadComponent,
    NextbackNavigationComponent,
    DynamicComponentDirective,
    AssignmentUploadDeclarationComponent,
    SubmissionConfirmationComponent
  ],
})
export class VeriguideSubmissionUpload2Module { }
