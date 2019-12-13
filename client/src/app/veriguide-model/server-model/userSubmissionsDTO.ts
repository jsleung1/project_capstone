import { DownloadCellUrlDTO } from '../models';

export class UserSubmissionsDTO  {
    studentName?: string;
    studentLoginId?: string;
    submissionId?: number;
    submissionTime?: string;
    fileName?: string;

    // similarity / report attributes
    similarity?: string;
    reportStatus?: string;
    reportLink?: string;
    isReportLink?: boolean;
    taskStatus?: string;

    // for cell rendering
    submissionDownloadCellDTO?: DownloadCellUrlDTO;

}
