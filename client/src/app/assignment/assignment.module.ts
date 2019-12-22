import { VerimarkerCommonUiModule } from '../common-ui/verimarker-common-ui.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignmentRoutingModule } from './assignment-routing.module';
import { AssignmentInfoComponent } from './assignment-info/assignment-info.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateAssignmentComponent } from './create-assignment/create-assignment.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    AssignmentRoutingModule,
    VerimarkerCommonUiModule
  ],
  declarations: [AssignmentInfoComponent, CreateAssignmentComponent]
})
export class VAssignmentModule { }
