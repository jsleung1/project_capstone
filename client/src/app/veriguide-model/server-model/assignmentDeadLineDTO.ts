import {SystemParam, TranslateCellActionDTO} from '../models';

export interface AssignmentDeadLineDTO extends SystemParam {
    school_id?: number;
    acad_year?: number;
    term?: string;
    yearTerm?: string;
    subject_area?: string;
    catalog_number?: string;
    section_code?: string;
    courseTitle?: string;
    assignment_number?: number;
    teacher_id?: string;
    deadline?: Date;
    allow?: string;
    allowSubmissionAfterDeadLine?: boolean;
    canUserUploadSubmission?: boolean;
    dueDate?: string;
    assignmentDeadLineExist?: boolean;

    // for cell rendering
    courseCode?: string;
    allowSubmissionAfterDeadLineYN?: string;
    removeDeadlineCellDTO?: TranslateCellActionDTO;
}
