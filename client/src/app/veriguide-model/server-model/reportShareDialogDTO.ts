import { ReportSharedUserDTO } from './reportSharedUserDTO';
import { ReportShareAssignableRoleDTO } from './reportShareAssignableRoleDTO';
import { ErrorDTO } from './errorDTO';


export class ReportShareDialogDTO extends ErrorDTO {
    reportSharedUserDTOs: Array<ReportSharedUserDTO>;
    reportAssignableRoleDTOs: Array<ReportShareAssignableRoleDTO>;
}
