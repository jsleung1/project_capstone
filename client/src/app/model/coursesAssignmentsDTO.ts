import { Course } from './rest-api-response/Course';
import { Assignment } from './rest-api-response/Assignment';

export interface CoursesAssignmentsDTO {
    courses: Course[];
    assignments: Assignment[];
}