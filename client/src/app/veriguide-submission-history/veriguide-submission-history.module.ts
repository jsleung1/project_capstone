import { VerimarkerCommonUiModule } from '../common-ui/verimarker-common-ui.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VeriguideSubmissionHistoryRoutingModule } from './veriguide-submission-history-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    VeriguideSubmissionHistoryRoutingModule,
    VerimarkerCommonUiModule,
    NgbModule
  ]
})
export class VeriguideSubmissionHistoryModule { }
