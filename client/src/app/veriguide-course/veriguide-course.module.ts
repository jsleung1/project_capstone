import { VeriguideCommonUiModule } from '../common-ui/veriguide-common-ui.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VeriguideCourseRoutingModule } from './veriguide-course-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VeriguideCourseInfoComponent } from './veriguide-course-info/veriguide-course-info.component';
import { FormsModule } from '@angular/forms';
import { CreateCourseComponent } from './create-course/create-course.component';

@NgModule({
  imports: [
    CommonModule,
    VeriguideCourseRoutingModule,
    VeriguideCommonUiModule,
    FormsModule,
    NgbModule
  ],
  declarations: [
    VeriguideCourseInfoComponent,
    CreateCourseComponent,
  ]
})
export class VeriguideCourseModule { }
