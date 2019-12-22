import { VerimarkerCommonUiModule } from '../common-ui/verimarker-common-ui.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerimarkerCourseRoutingModule } from './veriguide-course-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CourseInfoComponent } from './course-info/course-info.component';
import { FormsModule } from '@angular/forms';
import { CreateCourseComponent } from './create-course/create-course.component';

@NgModule({
  imports: [
    CommonModule,
    VerimarkerCourseRoutingModule,
    VerimarkerCommonUiModule,
    FormsModule,
    NgbModule
  ],
  declarations: [
    CourseInfoComponent,
    CreateCourseComponent,
  ]
})
export class VerimarkerCourseModule { }
