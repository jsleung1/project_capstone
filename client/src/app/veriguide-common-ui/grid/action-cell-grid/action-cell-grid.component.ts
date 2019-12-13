
import { TranslateCellActionDTO } from '../../../veriguide-model/client-model/translateCellActionDTO';
import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../../veriguide-user-service/veriguide-user-service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-action-cell-grid',
  templateUrl: './action-cell-grid.component.html',
  styleUrls: ['./action-cell-grid.component.css']
})
export class ActionCellGridComponent implements AgRendererComponent {

  actionCellGridItem: TranslateCellActionDTO;
  label: string;
  rowData: any;
  cellType = '';
  cellClickedRowAction?: Subject<any>;

  constructor( private modalService: NgbModal ) {
  }

  static cellValueForQuickSearch(record: TranslateCellActionDTO, translateService: TranslateService ): string {

    let translatedText1 = '';
    let translatedText2 = '';

    if ( ! UtilService.isStringEmpty( record.translateLabel1 ) ) {
      translatedText1 = translateService.instant( record.translateLabel1);
    }
    if ( ! UtilService.isStringEmpty( record.translateLabel2  ) ) {
      translatedText2 = translateService.instant( record.translateLabel2);
    }

    return translatedText1 + ' ' + record.nonTranslateLabel + ' ' + translatedText2;
  }

  agInit(params: ICellRendererParams): void {
    this.rowData = params.data;

    if ( params.value ) {
        if ( ! UtilService.isStringEmpty( params.value.getPropertyName ) ) {
          const getPropertyName: string = params.value.getPropertyName;
          this.actionCellGridItem = Reflect.get( params.data, getPropertyName );
        }

        if ( ! UtilService.isStringEmpty( params.value.cellType ) ) {
          this.cellType = params.value.cellType;
        }

        this.cellClickedRowAction = params.value.onActionHandler;
    }
  }

  refresh(params: any): boolean {
    return true;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {

  }

  onAction(): void {
    if ( this.cellClickedRowAction ) {
      this.cellClickedRowAction.next( this.rowData );
    }
  }

  toString = (): string => {
    return 'veriguide test';
  }
}
