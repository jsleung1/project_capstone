import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk'
import * as uuid from 'uuid'

import { Submission } from '../models/Submission';

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

// get all submissions uploaded to the Assigment Id
export async function getAllSubmissionsByAssignmentId( assignmentId: string ): Promise<Submission[]> {
    return await submissionAccess.getAllSubmissionsByAssignmentId(assignmentId);
}

// get submissions uploaded by the student Id
export async function getAllSubmissionsByStudentId( studentId: string ): Promise<Submission[]> {
    return await submissionAccess.getAllSubmissionsByStudentId( studentId );
}

export async function createSubmission( createSubmissionRequest: CreateSubmissionRequest, studentId: string ) : Promise<Submission> {

    const assignment = await assignmentAccess.getAssignmentByAssigmentId( createSubmissionRequest.assignmentId )
    if ( !assignment ) {
        throw new Error('Cannot find assignment to upload submission')
    }
    const studentUser = await userAccess.getUserByUserId( studentId )
    if ( !studentUser ) {
        throw new Error('Cannot find the registered student to upload submission')
    }

    const instructorUser = await userAccess.getUserByUserId( assignment.instructorId )
    if ( !instructorUser ) {
        throw new Error('Cannot find the registered instructor to receive the submission upload')
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
        similarityPercentage: null,
        reportStatus: null,
        studentRemarks: createSubmissionRequest.studentRemarks,
        submissionFileUrl,
        submissionUploadUrl
    })

    logger.info('Create submission successful:' + JSON.stringify( savedSubmission ))
    return savedSubmission;
}

// only update the student remarks for the submission
export async function updateSubmission( updateSubmissionRequest: UpdateSubmissionRequest, submissionId: string, studentId: string ) : Promise<Submission> {

    const studentSubmissions = await submissionAccess.getAllSubmissionsByStudentId( studentId )
    if ( studentSubmissions.length == 0 ) {
        throw new Error('Student has no submission to update')
    }

    const submissionToUpdate = studentSubmissions.find( s => s.submissionId == submissionId )
    if ( !submissionToUpdate ) {
        throw new Error('Cannot find the student submission to update')
    }

    submissionToUpdate.instructorComments = updateSubmissionRequest.instructorComments
    submissionToUpdate.studentScore = updateSubmissionRequest.studentScore
    submissionToUpdate.similarityPercentage = updateSubmissionRequest.similarityPercentage
    submissionToUpdate.reportStatus = updateSubmissionRequest.reportStatus
    submissionToUpdate.studentRemarks = updateSubmissionRequest.studentRemarks;

    const submissionUpdated = await submissionAccess.updateSubmission( submissionToUpdate )
    return submissionUpdated;
}

export async function deleteSubmission( submissionId: string, studentId: string ): Promise<Submission> {

    const studentSubmissions = await submissionAccess.getAllSubmissionsByStudentId( studentId )
    if ( studentSubmissions.length == 0 ) {
        throw new Error('Student has no submission to delete')
    }

    const submissionToDelete = studentSubmissions.find( s => s.submissionId == submissionId )
    if ( !submissionToDelete ) {
        throw new Error('Cannot find the student submission to delete')
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
