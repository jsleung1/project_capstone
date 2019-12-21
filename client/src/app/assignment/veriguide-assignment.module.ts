import { VeriguideCommonUiModule } from './../veriguide-common-ui/veriguide-common-ui.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VeriguideAssignmentRoutingModule } from './assignment-routing.module';
import { AssignmentInfoComponent } from './assignment-info/assignment-info.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateAssignmentComponent } from './create-assignment/create-assignment.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    VeriguideAssignmentRoutingModule,
    VeriguideCommonUiModule
  ],
  declarations: [AssignmentInfoComponent, CreateAssignmentComponent]
})
export class VeriguideAssignmentModule { }
