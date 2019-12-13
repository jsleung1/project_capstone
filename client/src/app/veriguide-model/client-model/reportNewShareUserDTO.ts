import { SystemParam, ReportShareAssignableRoleDTO, ListCellDTO } from '../models';

export interface ReportNewShareUserDTO {

    // server / client attributes (share user as USER)
    userName?: string;

    // server attributes
    computingId?: string;
    universityId?: string;
    email?: string;
    isValid?: boolean;

    // client attributes for shareType as USER
    loginId?: string;
    loginType?: SystemParam;

    // client attributes for shareType as ROLE
    // postId?: number;
    selectedRole?: ReportShareAssignableRoleDTO;

    reportAssignableRoleDTOs?: Array<ReportShareAssignableRoleDTO>; // for role dropdown selection box

    // other client attributes
    id?: number;
    shareType?: string;
    isValidated?: boolean;

    /*
    // server get attributes
    sharee?: string;
    share_mode?: string;
    shareeUserName?: string;
    shareeUniversityId?: string;
    shareeEmail?: string;

    sharedRoleUserDTOs?: Array<ReportNewShareUserDTO>;

    // for further GUI display
    sharedComputingIds?: ListCellDTO;
    sharedUniversityIds?: ListCellDTO;
    sharedEmails?: ListCellDTO;
    */
}
