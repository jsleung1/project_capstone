import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VeriguideSubmissionsRoutingModule } from './veriguide-submissions-routing.module';
import { VeriguideCommonUiModule } from '../veriguide-common-ui/veriguide-common-ui.module';

@NgModule({
  imports: [
    CommonModule,
    VeriguideSubmissionsRoutingModule,
    VeriguideCommonUiModule
  ]
})
export class VeriguideSubmissionsModule { }
