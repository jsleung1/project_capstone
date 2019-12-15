import { Assignment } from 'src/app/veriguide-model/rest-api-response/Assignment';
import { NgbTimeStruct, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export interface AssignmentInfo {

    assignment: Assignment;
    ngbDateStruct: NgbDateStruct;
    ngbTimeStruct: NgbTimeStruct ;

}