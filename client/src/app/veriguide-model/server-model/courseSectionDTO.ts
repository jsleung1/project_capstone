import { SystemParam } from '../models';


export interface CourseSectionDTO extends SystemParam {
    acadyear?: number;
    term?: string;
    subjectArea?: string;
    catalogNumber?: string;
    sectionCode?: string;
    yearTermCourseCodeSection?: string;
    courseCodeSection?: string;
    courseTitle?: string;
    schoolId?: number;
}
