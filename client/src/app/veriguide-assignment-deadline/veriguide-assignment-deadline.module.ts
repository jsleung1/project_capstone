import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { VeriguideAssignmentDeadlineRoutingModule } from './veriguide-assignment-deadline-routing.module';
import {VeriguideCommonUiModule} from '../veriguide-common-ui/veriguide-common-ui.module';
import {
  AssignmentDeadlineComponent,
  AssignmentDeadlineCreationFormComponent,
  FormCourseSelectionComponent,
  FormAssignmentDetailsComponent
} from './veriguide-assignment-deadline.components';

@NgModule({
  declarations: [
    AssignmentDeadlineComponent,
    AssignmentDeadlineCreationFormComponent,
    FormCourseSelectionComponent,
    FormAssignmentDetailsComponent
  ],
  imports: [
    CommonModule,
    VeriguideAssignmentDeadlineRoutingModule,
    VeriguideCommonUiModule,
    NgbModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class VeriguideAssignmentDeadlineModule { }
