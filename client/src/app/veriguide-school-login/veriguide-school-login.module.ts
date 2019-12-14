import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VeriguideSchoolLoginRoutingModule } from './veriguide-school-login-routing.module';
import { SchoolLoginComponent } from './school-login/school-login.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../veriguide-common-type/common-factory';
import {HttpClient} from '@angular/common/http';
import { VeriguideCommonUiModule } from '../veriguide-common-ui/veriguide-common-ui.module';

@NgModule({
  declarations: [
    SchoolLoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    VeriguideSchoolLoginRoutingModule,
    VeriguideCommonUiModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ]
})
export class VeriguideSchoolLoginModule {

  constructor() {
  }
}
