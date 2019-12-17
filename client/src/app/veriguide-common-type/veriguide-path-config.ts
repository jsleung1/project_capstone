import { UrlPathConfig } from './url-path-config';

export const VeriguidePathConfig: UrlPathConfig = {
    userLoginPage: {
        fullPath: '/school',
        relativePath: 'login'
    },
    userAuth0CallBackPath: {
        fullPath: '/school/auth0',
        relativePath: 'auth0'
    },
    userRegistrationPage: {
        fullPath: '/school/registration/:userId',
        relativePath: 'registration/:userId'
    },
    userMainPage : {
        fullPath: '/school/main',
        relativePath: 'main'
    },
    userSubmissionUpload: {
        fullPath: '/school/main/uploadSubmission',
        relativePath: 'uploadSubmission'
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
        fullPath: ':courseId/assignments',
        relativePath: 'assignments'
    },
    userCreateAssignment: {
        fullPath: ':courseId/assignments/createAssignment',
        relativePath: 'createAssignment'
    },
    userThesisSubmissionUpload: {
        fullPath: '/school/main/thesisSubmissionUpload',
        relativePath: 'thesisSubmissionUpload'
    },
    userCourses : {
        fullPath: '/school/main/courses',
        relativePath: 'courses'
    },
    userCreateCourse: {
        fullPath: '/school/main/courses/createCourse/:acadYear',
        relativePath: 'createCourse/:acadYear'
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


