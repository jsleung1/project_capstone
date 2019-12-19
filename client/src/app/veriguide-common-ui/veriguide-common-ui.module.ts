import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AgGridModule } from 'ag-grid-angular';
import { VeriguideCommonUiRoutingModule } from './veriguide-common-ui-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../veriguide-common-type/common-factory';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';

import { DownloadCellGridComponent, ActionCellGridComponent, AddReportOwnerDialogComponent,
  ListCellGridComponent, VeriguideGridComponent, AlertDialogComponent,
  LabelurlCellGridComponent, ReportLinkCellGridComponent, LoadingDialogComponent, EndorseShareRequestComponent } from './common-ui';
import { UserRegistrationComponent } from './component/user-registration/user-registration.component';
import { SubmissionsHistoryComponent } from './component/submissions-history/submissions-history.component';

@NgModule({
  imports: [
    CommonModule,
    AgGridModule.withComponents([
      LabelurlCellGridComponent,
      DownloadCellGridComponent,
      ReportLinkCellGridComponent,
      ActionCellGridComponent,
      ListCellGridComponent,
      EndorseShareRequestComponent
    ]),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgbModule,
    NgxSpinnerModule,
    VeriguideCommonUiRoutingModule,
    FormsModule,
  ],
  entryComponents: [
    AlertDialogComponent,
    AddReportOwnerDialogComponent
  ],
  exports: [
    VeriguideGridComponent
  ],
  declarations: [
    AlertDialogComponent,
    VeriguideGridComponent,
    DownloadCellGridComponent,
    LabelurlCellGridComponent,
    ReportLinkCellGridComponent,
    LoadingDialogComponent,
    ActionCellGridComponent,
    AddReportOwnerDialogComponent,
    ListCellGridComponent,
    EndorseShareRequestComponent,
    UserRegistrationComponent,
    SubmissionsHistoryComponent 
  ]
})
export class VeriguideCommonUiModule { }
