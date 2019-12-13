import { VeriguideCommonUiModule } from './../veriguide-common-ui/veriguide-common-ui.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VeriguideCourseRoutingModule } from './veriguide-course-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    VeriguideCourseRoutingModule,
    VeriguideCommonUiModule,
    NgbModule
  ]
})
export class VeriguideCourseModule { }
