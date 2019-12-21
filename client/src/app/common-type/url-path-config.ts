import { UrlPathInfo } from './url-path-info';
export interface UrlPathConfig {
    userLoginPage: UrlPathInfo;
    userAuth0CallBackPath: UrlPathInfo;
    userRegistrationPage: UrlPathInfo;

    userMainPage: UrlPathInfo;

    userSubmissionUpload: UrlPathInfo;

    userAssignmentSubmissionHistory: UrlPathInfo;

    userCourses: UrlPathInfo;
    userCreateCourse: UrlPathInfo;

    userAssignments: UrlPathInfo;
    userCreateAssignment: UrlPathInfo;

    userSubmissions: UrlPathInfo;

}
