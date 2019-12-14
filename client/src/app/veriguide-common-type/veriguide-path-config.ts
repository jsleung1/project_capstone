import { UrlPathConfig } from './url-path-config';

export const VeriguidePathConfig: UrlPathConfig = {
    userLoginPage: {
        fullPath: '/school',
        relativePath: 'login'
    },
    userAuth0CallBackPath: {
        fullPath: '/school/main/auth0',
        relativePath: 'auth0'
    },
    userRegistrationPage: {
        fullPath: '/school/registration',
        relativePath: 'registration'
    },
    userMainPage : {
        fullPath: '/school/main',
        relativePath: 'main'
    },
    userSubmissionUpload: {
        fullPath: '/school/main/submissionUpload',
        relativePath: 'submissionUpload'
    },
    userAssignmentSubmissionUploadSuccess : {
        fullPath: '/school/main/submissionSelect/uploadSuccess',
        relativePath: 'uploadSuccess'
    },
    userAssignmentSubmissionUploadFailed : {
        fullPath: '/school/main/submissionSelect/uploadFailed',
        relativePath: 'uploadFailed'
    },
    userAssignmentSubmissionHistory : {
        fullPath: '/school/main/submissionHistory',
        relativePath: 'submissionHistory'
    },
    userAssignments: {
        fullPath: ':yearTermCourseCodeSection/assignments',
        relativePath: 'assignments'
    },
    userThesisSubmissionUpload: {
        fullPath: '/school/main/thesisSubmissionUpload',
        relativePath: 'thesisSubmissionUpload'
    },
    userCourses : {
        fullPath: '/school/main/courses',
        relativePath: 'courses'
    },
    userAssignmentDeadline : {
        fullPath: '/school/main/assignmentDeadline',
        relativePath: 'assignmentDeadline'
    },
    userAssignmentDeadlineCreate : {
        fullPath: '/school/main/assignmentDeadline/deadlineCreate',
        relativePath: 'deadlineCreate'
    },
    userSubmissions: {
        fullPath: ':assignmentNumber/submissions',
        relativePath: 'submissions'
    },
    userShareRequestEndorsement : {
        fullPath: '/school/main/share',
        relativePath: 'share'
    },
    userPersonnel : {
        fullPath: '/school/main/personnel',
        relativePath: 'personnel'
    },
};


