import { AcadYearDTO } from '../models';
import { SystemParam } from './systemParam';

export interface UploadSubmissionSelectionDTO {
    acadYears?: Array<AcadYearDTO>;
    terms?: Array<SystemParam>;
}
