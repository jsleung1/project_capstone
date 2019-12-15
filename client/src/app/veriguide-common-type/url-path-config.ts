import { UrlPathInfo } from './url-path-info';
export interface UrlPathConfig {
    userLoginPage: UrlPathInfo;
    userAuth0CallBackPath: UrlPathInfo;
    userRegistrationPage: UrlPathInfo;

    userMainPage: UrlPathInfo;

    userSubmissionUpload: UrlPathInfo;

    userAssignmentSubmissionUploadSuccess: UrlPathInfo;
    userAssignmentSubmissionUploadFailed: UrlPathInfo;
    userAssignmentSubmissionHistory: UrlPathInfo;

    userThesisSubmissionUpload: UrlPathInfo;

    userCourses: UrlPathInfo;
    userCreateCourse: UrlPathInfo;

    userAssignments: UrlPathInfo;
    userAssignmentDeadline: UrlPathInfo;
    userAssignmentDeadlineCreate: UrlPathInfo;

    userSubmissions: UrlPathInfo;

    userShareRequestEndorsement: UrlPathInfo;

    userPersonnel: UrlPathInfo;
}
