import { DownloadCellUrlDTO } from '../models';

export class UserSubmissionHistoryDTO  {
  submissionId?: number;
  submissionTime?: string;
  yearTerm?: string;
  courseCode?: string;
  assignmentNumber?: number;

  declarationFileName?: string;
  submissionFileName?: string;

  // cell render field
  downloadSubmissionFile?: DownloadCellUrlDTO;
  downloadDeclarationFile?: DownloadCellUrlDTO;

  acadYear?: number;
  term?: string;

  yearTermCourseCodeSection?: string;

  // similarity / report attributes
  similarity?: string;
  reportStatus?: string;
  reportLink?: string;
  isReportLink?: boolean;
  taskStatus?: string;

}
