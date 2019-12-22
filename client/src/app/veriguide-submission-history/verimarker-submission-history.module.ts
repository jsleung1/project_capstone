import { VerimarkerCommonUiModule } from '../common-ui/verimarker-common-ui.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerimarkerSubmissionHistoryRoutingModule } from './verimarker-submission-history-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    VerimarkerSubmissionHistoryRoutingModule,
    VerimarkerCommonUiModule,
    NgbModule
  ]
})
export class VerimarkerSubmissionHistoryModule { }
