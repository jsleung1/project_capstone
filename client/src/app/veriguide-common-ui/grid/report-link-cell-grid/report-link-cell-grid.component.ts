import { VeriguideHttpClient } from 'src/app/veriguide-rest-service/veriguide-http-client';
import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { UserSubmissionsDTO } from '../../../veriguide-model/models';

@Component({
  selector: 'app-report-link-cell-grid',
  templateUrl: './report-link-cell-grid.component.html',
  styleUrls: ['./report-link-cell-grid.component.css']
})
export class ReportLinkCellGridComponent implements AgRendererComponent, OnInit {
  private record: UserSubmissionsDTO;
  // private reportLinkDTO: ReportLinkDTO = null;

  constructor( private veriguideHttpClient: VeriguideHttpClient) {
  }

  ngOnInit() {
  }

  refresh(params: any): boolean {
    return true;
  }
  agInit(params: ICellRendererParams): void {
    this.record = params.data;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
  }

  onViewReport() {
    this.veriguideHttpClient.get<ReportLinkDTO>( 'submissions/originalityReport/' + this.record.submissionId )
      .subscribe( reportLinkDTO => {
        // this.reportLinkDTO = reportLinkDTO;
        const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

        // if safari, we use direct to link instead of pop new window to avoid the safari pop-up blocker
        if ( isSafari || iOS ) {
          window.location.href = reportLinkDTO.reportLink;
        }  else {
          window.open( reportLinkDTO.reportLink );
        }
      }) ;
  }

  onCopyReportLinkToClipBoard() {
    this.veriguideHttpClient.get<ReportLinkDTO>( 'submissions/originalityReport/' + this.record.submissionId )
      .subscribe( reportLinkDTO => {
        // this.reportLinkDTO = reportLinkDTO;
        this.copyToClipboard( reportLinkDTO.reportLink );
      }) ;
  }

  copyToClipboard(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    // document.body.removeChild(selBox);
  }
}
