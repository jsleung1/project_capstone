import { TranslateCellActionDTO } from '../client-model/translateCellActionDTO';
import { LabelUrlCellDTO } from '../client-model/labelUrlCellDTO';

export interface UserCourseSectionDTO  {

    yearTermCourseCodeSection?: string;
    acad_year?: number;
    term?: string;
    subject_area?: string;
    catalog_number?: string;
    section_code?: string;
    school_login?: string;
    yearTerm?: string;
    courseCode?: string;
    course_title?: string;
    shareCount?: number;
    sharees?: string;
    userName?: string;
    enrollmentSize?: number;
    shareStatus?: string;
    canUserShare?: boolean;

    // for cell rendering
    courseCodeUrlCellDTO?: LabelUrlCellDTO ;
    userNameCellDTO?: TranslateCellActionDTO;
    shareCountCellDTO?: TranslateCellActionDTO;

}
