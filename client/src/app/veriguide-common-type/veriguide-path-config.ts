import { UrlPathConfig } from './url-path-config';

export const VeriguidePathConfig: UrlPathConfig = {
    userLoginPage: {
        fullPath: '/school',
        relativePath: 'login'
    },
    userMainPage : {
        fullPath: '/school/main',
        relativePath: 'main'
    },
    userSubmissionUploadMain: {
        fullPath: '/school/main/submissionSelect',
        relativePath: 'submissionSelect'
    },
    userAssignmentSubmissionUpload : {
        fullPath: '/school/main/submissionSelect/assignmentUpload',
        relativePath: 'assignmentUpload'
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
    userReportCase : {
        fullPath: '/school/main/reportCase',
        relativePath: 'reportCase'
    },
    userPersonnel : {
        fullPath: '/school/main/personnel',
        relativePath: 'personnel'
    },
    userErrorSubmission : {
        fullPath: '/school/main/errorSubmission',
        relativePath: 'errorSubmission'
    },
    userReportToDC : {
        fullPath: '/school/main/reportToDC',
        relativePath: 'reportToDC'
    },
    userThesis : {
        fullPath: '/school/main/thesis',
        relativePath: 'thesis'
    },
    userResource : {
        fullPath: '/school/main/resource',
        relativePath: 'resource'
    },
};


