import { UrlPathConfig } from './url-path-config';

export const VerimarkerPathConfig: UrlPathConfig = {
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
    userAssignmentSubmissionHistory : {
        fullPath: '/school/main/submissionHistory/:assignmentId',
        relativePath: 'submissionHistory/:assignmentId'
    },
    userAssignments: {
        fullPath: ':courseId/assignments',
        relativePath: 'assignments'
    },
    userCreateAssignment: {
        fullPath: ':courseId/assignments/createAssignment',
        relativePath: 'createAssignment'
    },
    userCourses : {
        fullPath: '/school/main/courses',
        relativePath: 'courses'
    },
    userCreateCourse: {
        fullPath: '/school/main/courses/createCourse/:acadYear',
        relativePath: 'createCourse/:acadYear'
    },
    userSubmissions: {
        fullPath: ':assignmentNumber/submissions',
        relativePath: 'submissions'
    }
};


