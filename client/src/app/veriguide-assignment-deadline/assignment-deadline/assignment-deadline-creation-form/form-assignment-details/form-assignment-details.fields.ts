import {ValidatorFn, Validators} from '@angular/forms';

import {SystemParam, AssignmentNumberDTO} from '../../../../veriguide-model/models';

export const namesFieldItems: {[key: string]: string} = {
  aNum: 'assignmentNum',
  aDl: 'assignmentDeadline',
  aAllow: 'assignmentAllow'
};

export const dValueFieldItems: {[key: string]: any} = {
  aNum: 1,
  aDl: null,
  aAllow: true,
};

export const valuesFieldItems: {[key: string]: any} = {
  aNum: valuesAssignmentNum(),
  aDl: null,
  aAllow: valuesAssignmentAllow(),
};

export const validatorsFieldItems: {[key: string]: ValidatorFn[]} = {
  aNum: [Validators.required],
  aDl: [Validators.required],
  aAllow: [Validators.required],
};

export const validationMessagesFieldItems: {[key: string]: {[key: string]: string}} = {
  aNum: { required: 'assignmentDeadline.creationForm.requiredField' },
  aDl: { required: 'assignmentDeadline.creationForm.requiredField' },
  aAllow: { required: 'assignmentDeadline.creationForm.requiredField' },
};

function valuesAssignmentNum(): AssignmentNumberDTO[] {
  const arrAssignmentNums: AssignmentNumberDTO[] = [];
  const numAssignments = 100;
  for (let numA = 1; numA <= numAssignments; numA++) {
    this.arrAssignmentNums.push({id: numA, name: numA.toString(), assignment_number: numA});
  }
  return arrAssignmentNums;
}

function valuesAssignmentAllow(): SystemParam[] {
  const arrAssignmentAllow: SystemParam[] = [];
  this.arrAssignmentAllow.push({id: 1, name: 'assignmentDeadline.allow.yes', value: true});
  this.arrAssignmentAllow.push({id: 2, name: 'assignmentDeadline.allow.no', value: false});
  return arrAssignmentAllow;
}
