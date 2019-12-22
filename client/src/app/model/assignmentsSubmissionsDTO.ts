import { Assignment } from './rest-api-response/Assignment';
import { Submission } from './rest-api-response/Submission';

export interface AssignmentsSubmissionsDTO {
    assignments: Assignment[];
    submissions: Submission[];
}