export enum VeriguideAssignmentDeadlineState {
  Init = 0,
  AssignmentDeadlinesList = 1,
  DeadlineCreationForm = 2,
  CourseSelectInCreation = 3,
  AssignmentDetailInCreation = 4,
  DeadlineCreationSubmit = 5,
  DeadlineCreationSubmitSuccess = 6,  // should be back to list page
  DeadlineCreationSubmitFailed = 7,   // should be back to list page
  Closed = 8
}
