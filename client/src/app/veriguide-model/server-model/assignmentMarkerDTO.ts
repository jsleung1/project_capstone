import { SystemParam } from '../models';

export interface AssignmentMarkerDTO extends SystemParam {
    primaryLoginId?: string;
    secondaryLoginId?: string;
    schoolId?: number;
    yearTermCourseCodeSection?: string;
}

