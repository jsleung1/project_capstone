import { VeriguideHttpClient } from './../../../veriguide-rest-service/veriguide-http-client';
import { ReportSharingRequestShareeDTO } from './../../../veriguide-model/server-model/reportSharingRequestShareeDTO';
import { AgRendererComponent } from 'ag-grid-angular';
import { Component } from '@angular/core';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-veriguide-endorse-share',
  templateUrl: './endorse-share-request.component.html',
  styleUrls: ['./endorse-share-request.component.css']
})
export class EndorseShareRequestComponent implements AgRendererComponent {

  private record: ReportSharingRequestShareeDTO;
  private endorseBy: string;
  private confirmShareRequestAction?: Subject<ReportSharingRequestShareeDTO>;

  static getRowHeight( params: any ): number {
    return 150;
  }


  static cellValueForQuickSearch( record: ReportSharingRequestShareeDTO ): string {

    return record.yearTermCourseCodeSectionName + '|' + record.shareeName + '|' + record.courseOwnerName
      + '|' + record.shareRequesterName + '|' + record.endorsement_status + '|' + record.request_time;

  }

  refresh(params: any): boolean {
    return true;
  }

  agInit(params: ICellRendererParams): void {
    this.record = params.data;
    this.record.approve = 'Accepted';

    this.endorseBy = (this.record.endorse_type === 'ORIGINAL_OWNER' ? 'endorseShareRequest.originalOwner' : 'endorseShareRequest.noEndorsement' );
    this.confirmShareRequestAction = params.value.onActionHandler;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {

  }

  constructor( ) {
  }

  onApproveRequest() {
    this.record.approve = 'Accepted';
  }

  onRejectRequest() {
    this.record.approve = 'Declined';
  }

  onConfirm() {
    this.confirmShareRequestAction.next( this.record );
  }


}
