import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VeriguideSchoolLoginRoutingModule } from './veriguide-school-login-routing.module';
import { SchoolLoginComponent } from './school-login/school-login.component';
import { VerimarkerCommonUiModule } from '../common-ui/verimarker-common-ui.module';

@NgModule({
  declarations: [
    SchoolLoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    VeriguideSchoolLoginRoutingModule,
    VerimarkerCommonUiModule
  ]
})
export class VeriguideSchoolLoginModule {

  constructor() {
  }
}
