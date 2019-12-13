import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { Router } from '@angular/router';
import { VeriguideHttpClient } from 'src/app/veriguide-rest-service/veriguide-http-client';
import { saveAs } from 'file-saver';
import { DownloadCellUrlDTO } from 'src/app/veriguide-model/models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-download-cell-grid',
  templateUrl: './download-cell-grid.component.html',
  styleUrls: ['./download-cell-grid.component.css']
})
export class DownloadCellGridComponent implements AgRendererComponent, OnInit  {

  private record: DownloadCellUrlDTO;
  private blobType = '';
  private fileType = '';

  constructor( private router: Router,
               private veriguideHttpClient: VeriguideHttpClient ) {
  }

  static cellValueForQuickSearch(record: DownloadCellUrlDTO, translateService: TranslateService ) {

    if ( record.showDefaultDownloadLabel === true ) {
      return translateService.instant( 'common.download' );
    } else {
      return record.downloadFileName;
    }
  }

  refresh(params: any): boolean {
    return true;
  }
  agInit(params: ICellRendererParams): void {

    this.blobType = params.value.blobType;
    this.fileType = params.value.fileType;

    const readProperty = params.value.getPropertyName;
    this.record = Reflect.get( params.data, readProperty );
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
  }

  ngOnInit(): void {
  }

  download(): void {
    this.veriguideHttpClient.getBlob(this.record.downloadFileUrl ).subscribe( response => {
      this.downLoadFile( response, this.blobType ) ;
    });
  }

  downLoadFile(data: any, blobType: string) {
    const blob = new Blob( [data], { type: blobType} );

    let fullDownloadFileName = '';
    if ( this.fileType && this.fileType.length > 0 ) {
      fullDownloadFileName = this.record.downloadFileName + '.' + this.fileType;
    } else {
      fullDownloadFileName = this.record.downloadFileName;
    }

    saveAs(blob, fullDownloadFileName );
  }

}
