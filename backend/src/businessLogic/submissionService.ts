import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk'
import * as uuid from 'uuid'

import { Submission } from '../entities/Submission';

import { UserAccess } from './../dataLayer/userAccess';
import { AssignmentAccess } from './../dataLayer/assignmentAccess';
import { SubmissionAccess } from '../dataLayer/submissionAccess';

import { UpdateSubmissionRequest } from '../requests/submission/UpdateSubmissionRequest';
import { CreateSubmissionRequest } from '../requests/submission/CreateSubmissionRequest';

import { createLogger } from '../utils/logger';

const logger = createLogger('submissionService')

const submissionAccess = new SubmissionAccess()
const assignmentAccess = new AssignmentAccess()
const userAccess = new UserAccess()

const bucketName = process.env.VG_SUBMISSIONS_FILES_S3_BUCKET
const urlExpiration = Number( process.env.SIGNED_URL_EXPIRATION )

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

export async function getSubmissionsForInstructorOrStudent(assigmentId: string, userId: string): Promise<Submission[]> {
    const user = await userAccess.getUserByUserId(userId)
    if ( !user ) {
      throw new Error(`Cannot find user to return the corresponding submissions`)
    }
    const submissions = await submissionAccess.getAllSubmissionsByAssignmentId( assigmentId )   

    if ( user.userType === 'student') {
        const studentSubmissions = submissions.filter( s => s.studentId === userId )
        return studentSubmissions
    }
      
    if ( user.userType === 'instructor') {
        const instructorSubmissions = submissions.filter( s => s.instructorId === userId )
        return instructorSubmissions
    }

    throw new Error(`Cannot get the submissions with invalid userType`) 
  }

export async function createSubmission( createSubmissionRequest: CreateSubmissionRequest, studentId: string ) : Promise<Submission> {

    const studentUser = await userAccess.getUserByUserIdAndUserType(studentId, 'student')
    if ( !studentUser ) {
      throw new Error(`Invalid user to create the submission`)
    }

    const assignment = await assignmentAccess.getAssignmentByAssigmentId( createSubmissionRequest.assignmentId )
    if ( !assignment ) {
        throw new Error('Cannot find assignment to upload the submission')
    }

    const instructorUser = await userAccess.getUserByUserId( assignment.instructorId )
    if ( !instructorUser ) {
        throw new Error('Cannot find the instructor to receive the submission upload')
    }

    const submissionId: string = uuid.v4()
    const submissionFileUrl = `https://${bucketName}.s3.amazonaws.com/${submissionId}`
    const submissionUploadUrl = getUploadUrl( submissionId )

    const savedSubmission = await submissionAccess.createSubmission({
        submissionId,
        assignmentId: assignment.assignmentId,
        createdAt: new Date().toISOString(),
        assignmentName: assignment.assignmentName,
        studentId,
        studentName: studentUser.userName,
        studentEmail: studentUser.email,
        fileName: createSubmissionRequest.fileName,
        instructorId: assignment.instructorId,
        instructorName: instructorUser.userName,
        instructorComments: null,
        studentScore: null,
        studentRemarks: createSubmissionRequest.studentRemarks,
        submissionFileUrl,
        submissionUploadUrl,
        similarityPercentage: null,
        reportStatus: null,
        reportCreateTime: null
    })

    logger.info('Create submission successful:' + JSON.stringify( savedSubmission ))
    return savedSubmission;
}

// only update the student remarks for the submission
export async function updateSubmissionForInstructorOrStudent( updateSubmissionRequest: UpdateSubmissionRequest, submissionId: string, userId: string ) : Promise<Submission> {

    const user = await userAccess.getUserByUserId( userId )
    if ( !user ) {
        throw new Error('Cannot find the user to update the submission')
    }
    if ( user.userType === 'student') {
        const studentSubmissions = await submissionAccess.getAllSubmissionsByStudentId( userId )
        if ( studentSubmissions.length == 0 ) {
            throw new Error('Student has no submission to update')
        }
    
        const submissionToUpdate = studentSubmissions.find( s => s.submissionId === submissionId )
        if ( !submissionToUpdate ) {
            throw new Error('Cannot find the submission to update as an student')
        }
    
        // only student can update the remarks of the submission
        submissionToUpdate.studentRemarks = updateSubmissionRequest.studentRemarks;
    
        const submissionUpdated = await submissionAccess.updateSubmission( submissionToUpdate )
        return submissionUpdated;
    
    }
      
    if ( user.userType === 'instructor') {
        const instructorSubmissions = await submissionAccess.getAllSubmissionsByInstructorId( userId )
        if ( instructorSubmissions.length == 0 ) {
            throw new Error('Instructor has no submission to update')
        }

        const submissionToUpdate = instructorSubmissions.find( s => s.submissionId === submissionId )
        if ( !submissionToUpdate ) {
            throw new Error('Cannot find the submission to update as an instructor')
        }

        // instructor can update comments, student score etc. for the submission
        submissionToUpdate.instructorComments = updateSubmissionRequest.instructorComments
        submissionToUpdate.studentScore = updateSubmissionRequest.studentScore
        submissionToUpdate.similarityPercentage = updateSubmissionRequest.similarityPercentage
        submissionToUpdate.reportStatus = updateSubmissionRequest.reportStatus

        const submissionUpdated = await submissionAccess.updateSubmission( submissionToUpdate )
        return submissionUpdated;

    }

    throw new Error(`Cannot update the submission with invalid userType`) 

}

export async function deleteSubmission( submissionId: string, userId: string ): Promise<Submission> {

    const user = await userAccess.getUserByUserId( userId )
    if ( !user ) {
        throw new Error('Cannot find the user to delete the submission')
    }
    
    if ( user.userType !== 'student' && user.userType !== 'instructor') {
        throw new Error(`Cannot delete the submission with invalid userType`) 
    }

    let submissionsToDelete = []
    if ( user.userType === 'student') {
        submissionsToDelete = await submissionAccess.getAllSubmissionsByStudentId( userId )
    }
    if ( user.userType === 'instructor') {
        submissionsToDelete = await submissionAccess.getAllSubmissionsByInstructorId( userId )
    }
    
    const submissionToDelete = submissionsToDelete.find( s => s.submissionId === submissionId )
    if ( !submissionToDelete ) {
        throw new Error('Cannot find the submission to delete')
    }

    const deletedSubmission = await submissionAccess.deleteSubmission( submissionToDelete )
    return deletedSubmission
}

function getUploadUrl(submissionId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: submissionId,
        Expires: urlExpiration
    })
}
