import {ValidatorFn, Validators} from '@angular/forms';
import {AssignmentFileValidator} from '../form-validators/assignment.file.validator';

export const typeSubmissionString: {[key: string]: string} = {
  I: 'assignmentUpload.submission.type.idv',
  G: 'assignmentUpload.submission.type.gp'
};

export const namesFieldItems: {[key: string]: string} = {
  aMarker: 'assignmentMarker',
  aNum: 'assignmentNum',
  aDl: 'assignmentDeadline',
  aFile: 'assignmentFile',
  aFileD: 'assignmentFileData',
  sType: 'submissionType'
};

export const dValueFieldItems: {[key: string]: any} = {
  aMarker: '',
  aNum: '',
  aDl: null,
  aFile: '',
  aFileD: null,
  sType: null
};

export const validatorsFieldItems: {[key: string]: ValidatorFn[]} = {
  aMarker: [Validators.required],
  aNum: [Validators.required],
  aDl: [Validators.required],
  aFile: [Validators.required],
  aFileD: [Validators.required, AssignmentFileValidator.isFileOversize],
  sType: [Validators.required]
};

// using translation key string
export const validationMessagesFieldItems: {[key: string]: {[key: string]: string}} = {
  aMarker: { required: 'assignmentUpload.requiredField' },
  aNum: { required: 'assignmentUpload.requiredField' },
  aDl: { required: 'assignmentUpload.requiredField' },
  aFile: { required: 'assignmentUpload.requiredField' },
  aFileD: { required: 'assignmentUpload.requiredField', isFileOversize: 'assignmentUpload.errors.oversize' },
  sType: { required: 'assignmentUpload.requiredField' }
};
