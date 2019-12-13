import { VeriguideCommonUiModule } from './../veriguide-common-ui/veriguide-common-ui.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VeriguideMainRoutingModule } from './veriguide-main-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../veriguide-common-type/common-factory';

@NgModule({
  imports: [
    CommonModule,
    VeriguideMainRoutingModule,
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
export class VeriguideMainModule { }
