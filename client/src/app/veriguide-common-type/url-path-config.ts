import { UrlPathInfo } from './url-path-info';
export interface UrlPathConfig {
    userLoginPage: UrlPathInfo;
    userMainPage: UrlPathInfo;

    userSubmissionUploadMain: UrlPathInfo;

    userAssignmentSubmissionUpload: UrlPathInfo;
    userAssignmentSubmissionUploadSuccess: UrlPathInfo;
    userAssignmentSubmissionUploadFailed: UrlPathInfo;
    userAssignmentSubmissionHistory: UrlPathInfo;

    userThesisSubmissionUpload: UrlPathInfo;

    userCourses: UrlPathInfo;

    userAssignments: UrlPathInfo;
    userAssignmentDeadline: UrlPathInfo;
    userAssignmentDeadlineCreate: UrlPathInfo;

    userSubmissions: UrlPathInfo;

    userShareRequestEndorsement: UrlPathInfo;
    userReportCase: UrlPathInfo;
    userPersonnel: UrlPathInfo;
    userErrorSubmission: UrlPathInfo;
    userReportToDC: UrlPathInfo;
    userThesis: UrlPathInfo;
    userResource: UrlPathInfo;
}
