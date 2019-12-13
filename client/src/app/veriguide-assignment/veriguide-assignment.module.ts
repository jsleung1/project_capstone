import { VeriguideCommonUiModule } from './../veriguide-common-ui/veriguide-common-ui.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VeriguideAssignmentRoutingModule } from './veriguide-assignment-routing.module';
@NgModule({
  imports: [
    CommonModule,
    VeriguideAssignmentRoutingModule,
    VeriguideCommonUiModule
  ]
})
export class VeriguideAssignmentModule { }
