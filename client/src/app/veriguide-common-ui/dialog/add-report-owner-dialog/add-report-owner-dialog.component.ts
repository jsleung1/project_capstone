import { LoggedInUser } from './../../../veriguide-model/server-model/loggedInUser';
import { AddReportShareUserDTO } from './../../../veriguide-model/server-model/addReportShareUserDTO';
import { ListCellGridComponent } from './../../grid/list-cell-grid/list-cell-grid.component';
import { UtilService } from './../../../veriguide-user-service/util.service';
import { VeriguideHttpClient } from '../../../veriguide-rest-service/veriguide-http-client';

import { SystemParam } from './../../../veriguide-model/server-model/systemParam';

import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ListReportOwnerRowStyle } from './list-report-owner-row-style';
import { UserCourseSectionDTO, ReportNewShareUserDTO, ReportShareAssignableRoleDTO, ListCellDTO, ReportSharedUserDTO } from '../../../veriguide-model/models';
import { Subject } from 'rxjs';
import { AlertDialogService } from '../alert-dialog/alert-dialog-service';
import { ActionCellGridComponent } from '../../grid/action-cell-grid/action-cell-grid.component';

@Component({
  selector: 'app-add-report-owner-dialog',
  templateUrl: './add-report-owner-dialog.component.html',
  styleUrls: ['./add-report-owner-dialog.component.css'],
})
export class AddReportOwnerDialogComponent implements OnInit {
  @Input() userCourseSectionDTO: UserCourseSectionDTO;
  @Input() reportSharedUserDTOs: ReportSharedUserDTO[];
  @Input() reportAssignableRoleDTOs: ReportShareAssignableRoleDTO[];
  @Input() loggedInUser: LoggedInUser;

  boundGetRowHeightFunction: (params: any) => number;

  userDeleteExistingSharee = new Subject<ReportNewShareUserDTO>();

  columnDefs = [];
  rowStyle = new ListReportOwnerRowStyle();

  newSharees: Array<ReportNewShareUserDTO> = [];
  loginTypes: Array<SystemParam> = [];
  allocateIdx = 1;

  endorseType = 'ORIGINAL_OWNER';
  userConfirmed: boolean;

  formValidateResult: boolean;
  formLockedInput = false;
  serverValidateErrorMessage = '';

  constructor(private activeModal: NgbActiveModal,
              private veriguideHttpClient: VeriguideHttpClient,
              private alertDialogService: AlertDialogService ) {

    this.loginTypes.push({ id: 1, name: 'Computing Id'});
    this.loginTypes.push({ id: 2, name: 'University Id'});

    this.userDeleteExistingSharee.subscribe( reportSharedUserDTO => {
      this.onDeleteExistingSharee( reportSharedUserDTO );
    });
  }

  ngOnInit() {

    this.boundGetRowHeightFunction = this.getRowHeightSharee.bind(this);
    this.reportSharedUserDTOs.forEach( sharedUser => {

      const sharedComputingIds = new ListCellDTO();
      const sharedUniversityIds = new ListCellDTO();
      const sharedEmails = new ListCellDTO();

      if ( sharedUser.share_mode === 'USER') {

        sharedComputingIds.stringValues.push( sharedUser.sharee);
        sharedUniversityIds.stringValues.push( sharedUser.shareeUniversityId);
        sharedEmails.stringValues.push( sharedUser.shareeEmail);

      }

      if ( sharedUser.share_mode === 'ROLE'
           && sharedUser.sharedRoleUserDTOs
           && sharedUser.sharedRoleUserDTOs.length > 0 ) {

          const sharedRoleUsers = sharedUser.sharedRoleUserDTOs;

          sharedRoleUsers.forEach( sharedRoleUser => {
            sharedComputingIds.stringValues.push( sharedRoleUser.sharee);
            sharedUniversityIds.stringValues.push( sharedRoleUser.shareeUniversityId);
            sharedEmails.stringValues.push( sharedRoleUser.shareeEmail);
          });
      }

      sharedUser.sharedComputingIds = sharedComputingIds;
      sharedUser.sharedUniversityIds = sharedUniversityIds;
      sharedUser.sharedEmails = sharedEmails;

    });

    this.columnDefs = [
      { headerName: 'Delete', width: 120,
        cellRendererFramework: ActionCellGridComponent,
        cellRendererParams: {
          value: {
            cellType: 'deleteCrossButton',
            onActionHandler: this.userDeleteExistingSharee
          }
        }
      },
      { headerName: 'Share Type', field: 'share_mode', width: 140 },
      { headerName: 'Sharee Status', field: 'sharee_status', width: 170 },
      { headerName: 'Report Owner Name', field: 'shareeUserName', width: 300 },
      { headerName: 'Computing Id', width: 150,
        cellRendererFramework: ListCellGridComponent,
        cellRendererParams: {
          value: {
            getPropertyName: 'sharedComputingIds',
           }
        }
      },
      { headerName: 'University Id', width: 150,
        cellRendererFramework: ListCellGridComponent,
        cellRendererParams: {
          value: {
            getPropertyName: 'sharedUniversityIds',
           }
        }
      },
      { headerName: 'Email', width: 260,
        cellRendererFramework: ListCellGridComponent,
        cellRendererParams: {
          value: {
            getPropertyName: 'sharedEmails',
           }
        }
      }
    ];
    console.log( this.reportAssignableRoleDTOs );
  }

  onClose() {
    this.activeModal.close('Close click');
  }

  onAddShareRow( sharetype: string) {

    if ( sharetype === 'USER' ) {
      this.newSharees.push({
        id: this.allocateIdx++,
        shareType: sharetype,
        loginId: '',
        loginType: this.loginTypes[0],
        reportAssignableRoleDTOs: []
      });
    }

    if ( sharetype === 'ROLE' ) {
      this.newSharees.push({
        id: this.allocateIdx++,
        shareType: sharetype,
        selectedRole: null,
        loginType: this.loginTypes[0],
        reportAssignableRoleDTOs: this.reportAssignableRoleDTOs,
        isValidated: true
      });
    }
  }

  onDeleteExistingSharee( reportSharedUserDTO: ReportNewShareUserDTO ) {
    console.log('onDeleteExistingSharee');
  }

  async validateNewSharee( newSharee: ReportNewShareUserDTO ): Promise<ReportNewShareUserDTO> {
    newSharee.isValid = null;
    newSharee.isValidated = null;

    if ( newSharee.shareType === 'ROLE' ) {

      if ( newSharee.selectedRole == null ) {
        newSharee.isValid = false;
        newSharee.isValidated = true;
        newSharee.userName = 'Please select a role';
        return Promise.resolve( newSharee );
      }

      const foundShareeRole = this.reportSharedUserDTOs.find( s => {
        return ( s.share_mode === 'ROLE' && s.sharee === newSharee.selectedRole.post_id.toString() );
      } );

      if ( foundShareeRole ) {
        newSharee.isValid = false; // treat duplicate sharee ROLE as not exist
        newSharee.isValidated = true;
        newSharee.userName = 'Role is already shared / waiting for endorsement.';
        return Promise.resolve( newSharee );
      }

      newSharee.isValid = true;
      newSharee.isValidated = true;

    } else if ( newSharee.shareType === 'USER' ) {
      if ( UtilService.isStringEmpty( newSharee.loginId ) ) {
        newSharee.isValid = false;
        newSharee.isValidated = true;
        newSharee.userName = 'Login Id cannot be empty';
        return Promise.resolve( newSharee );
      }

      const foundShareeUser = this.reportSharedUserDTOs.find( s => {
        if ( s.share_mode === 'USER' ) {
          if ( newSharee.loginType.id === 1 && s.sharee === newSharee.loginId ) {
             return true;
          }
          if ( newSharee.loginType.id === 2 && s.shareeUniversityId === newSharee.loginId ) {
            return true;
          }
        }
        return false;
      });

      if ( foundShareeUser ) {
        newSharee.isValid = false; // treat duplicate sharee USER as not exist
        newSharee.isValidated = true;
        newSharee.userName = 'User is already shared / waiting for endorsement.';
        return Promise.resolve( newSharee );
      }

      // if shareType is USER, perform server valiation of USER
      const reportUserDTOPromise = this.veriguideHttpClient.get<ReportNewShareUserDTO>('sharing/validateReportShareUser/' + newSharee.loginType.id + '/' + newSharee.loginId ).toPromise();
      const reportUserDTO = await reportUserDTOPromise;

      newSharee.isValid = reportUserDTO.isValid;
      newSharee.isValidated = true;

      if ( newSharee.isValid === true ) {



        newSharee.userName = reportUserDTO.userName;
      } else {
        newSharee.userName = 'User specified is an invalid user';
      }

    }

    return Promise.resolve( newSharee );
  }


  onValidateNewSharee( sharee: ReportNewShareUserDTO ) {
    this.validateNewSharee( sharee );
  }

  onDeleteNewSharee( sharee: ReportNewShareUserDTO ) {

    if ( ( sharee.shareType === 'ROLE' && sharee.selectedRole != null )
      || ( sharee.shareType === 'USER' &&  ! UtilService.isStringEmpty( sharee.loginId ) ) ) {

        this.alertDialogService.openDialog({
          title: 'Delete Report Owner',
          message: 'Are you sure you want to delete this report owner (' + sharee.shareType + ') ?',
          dialogType: 'YesNoDialog'
        }).then( res => {
          if ( res === 'YES') {
            const indexToDelete = this.newSharees.findIndex( x => x.id === sharee.id );
            this.newSharees.splice( indexToDelete, 1 );
            if ( this.newSharees.length <= 0 ) {
              this.resetFlags();
            }
          }
        });

    } else {
      const indexToDelete = this.newSharees.findIndex( x => x.id === sharee.id );
      this.newSharees.splice( indexToDelete, 1 );
    }

    if ( this.newSharees.length <= 0 ) {
      this.resetFlags();
    }

  }

  resetForm( promptForUser?: boolean ) {
    if ( promptForUser === true ) {
      this.alertDialogService.openDialog({
        title: 'Reset Form',
        message: 'Are you sure you want to reset the form ?',
        dialogType: 'YesNoDialog'
      }).then( res => {
        if ( res === 'YES') {
          this.newSharees = [];
          this.resetFlags();
        }
      });
    } else {
      this.newSharees = [];
      this.resetFlags();
    }
  }

  async onNextValidateNewSharees() {
    this.formLockedInput = true;
    this.formValidateResult = null;
    this.serverValidateErrorMessage = '';

    let i = 0;
    this.newSharees.forEach( async newSharee => {
      const validatedNewSharee = this.validateNewSharee(newSharee);
      const reportUserDTO =  await validatedNewSharee;
      if ( reportUserDTO.isValid === false ) {
        this.formValidateResult = reportUserDTO.isValid;
      }
      if ( i === ( this.newSharees.length - 1 ) ) {
        // still not assign a false, so we continue validation to perform server validation
        // after the client validation of the last element in the list of newly report owners
        if ( this.formValidateResult == null ) {
          this.performServerValidationOnNewSharees();
        }
      }
      i++;
    });


    // this.performServerValidationOnNewSharees();
  }

  performServerValidationOnNewSharees() {
    const addReportShareUserDTO: AddReportShareUserDTO = {
      endorseType: this.endorseType,
      reportShareUserDTOs: this.newSharees,
      originalCourseOwner: this.userCourseSectionDTO.school_login
    };

    this.veriguideHttpClient.post<AddReportShareUserDTO>('sharing/' + this.userCourseSectionDTO.yearTermCourseCodeSection + '/validateReportShareUsers', addReportShareUserDTO )
    .subscribe( res => {

      this.formValidateResult = UtilService.isStringEmpty( res.errorMessage );
      this.serverValidateErrorMessage = res.errorMessage;
    });
  }

  onSubmitNewSharees() {

    const addReportShareUserDTO: AddReportShareUserDTO = {
      endorseType: this.endorseType,
      reportShareUserDTOs: this.newSharees,
      originalCourseOwner: this.userCourseSectionDTO.school_login
    };

    this.veriguideHttpClient.post<any>('sharing/' + this.userCourseSectionDTO.yearTermCourseCodeSection + '/addReportShareUsers', addReportShareUserDTO )
    .subscribe( reportShareDialogDTO => {

      this.reportSharedUserDTOs = reportShareDialogDTO.reportSharedUserDTOs;
      this.reportAssignableRoleDTOs = reportShareDialogDTO.reportAssignableRoleDTOs;
      this.ngOnInit();

      this.alertDialogService.openDialog({
        title: 'Report Sharing',
        message: 'Create new report sharing successful.',
        dialogType: 'OKDialog'
      }).then( res => {
        this.onClose();
      });
    });
  }

  getRowHeightSharee( params: any ): number {

    const reportSharedUserDTO: ReportSharedUserDTO = params.node.data;

    if ( reportSharedUserDTO.share_mode === 'ROLE'
         && reportSharedUserDTO.sharedRoleUserDTOs
         && reportSharedUserDTO.sharedRoleUserDTOs.length > 0 ) {
      if ( reportSharedUserDTO.sharedRoleUserDTOs.length === 1 ) {
        return 35;
      }
      return reportSharedUserDTO.sharedRoleUserDTOs.length * 30;
    } else {
      return 35;
    }
  }

  resetFlags() {
    this.formValidateResult = null;
    this.serverValidateErrorMessage = '';
    this.userConfirmed = null;
    this.formLockedInput = false;
  }
}
