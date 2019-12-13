import { ErrorDTO } from './errorDTO';
import { ReportNewShareUserDTO } from '../client-model/reportNewShareUserDTO';

export class AddReportShareUserDTO extends ErrorDTO {
    reportShareUserDTOs: Array<ReportNewShareUserDTO>;
    endorseType: string;
    submissionId?: number;
    assignmentNumber?: number;
    originalCourseOwner?: string;
}
