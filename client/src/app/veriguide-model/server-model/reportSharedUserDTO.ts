import { Subject } from 'rxjs';
import { ListCellDTO } from '../models';

export interface ReportSharedUserDTO {
    assignment_number?: number;
    submission_id?: number;
    share_level?: string;
    endorse_type?: string;
    share_existing?: boolean;
    request_time?: string;
    status?: string;

    request_id?: number;
    share_mode?: string;
    sharee?: string;
    sharee_status?: string;
    share_id?: number;
    is_valid?: boolean;
    sharee_role_unit?: string;

    shareeUserName?: string;
    shareeUniversityId?: string;
    shareeEmail?: string;

    sharedRoleUserDTOs?: Array<ReportSharedUserDTO>;

    // for further GUI display
    sharedComputingIds?: ListCellDTO;
    sharedUniversityIds?: ListCellDTO;
    sharedEmails?: ListCellDTO;

    cellClickedRowData?: Subject<any>;
}
