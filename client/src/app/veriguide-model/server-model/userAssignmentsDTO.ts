import { LabelUrlCellDTO, DownloadCellUrlDTO } from '../models';

export interface UserAssignmentsDTO  {
    assignment_number?: number;
    num_of_submissions?: number;
    submission_time?: string;
    submission_id?: number;
    school_login?: string;
    downloadFileName?: string;

    // for cell rendering
    assignmentNumberCellDTO?: LabelUrlCellDTO;
    assignmentDownloadCellDTO?: DownloadCellUrlDTO;
}
