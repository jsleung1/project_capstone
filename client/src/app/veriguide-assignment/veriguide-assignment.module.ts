import { VeriguideCommonUiModule } from './../veriguide-common-ui/veriguide-common-ui.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VeriguideAssignmentRoutingModule } from './veriguide-assignment-routing.module';
import { VeriguideAssignmentInfoComponent } from './veriguide-assignment-info/veriguide-assignment-info.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    VeriguideAssignmentRoutingModule,
    VeriguideCommonUiModule
  ],
  declarations: [VeriguideAssignmentInfoComponent]
})
export class VeriguideAssignmentModule { }
