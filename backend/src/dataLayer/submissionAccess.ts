import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { Submission } from '../entities/Submission';

const XAWS = AWSXRay.captureAWS(AWS)

export class SubmissionAccess {

    private logger = createLogger('SubmissionAccess')

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly submissionsTable = process.env.SUBMISSIONS_TABLE,
        private readonly submissionsSubmissionIdIndex = process.env.SUBMISSIONS_SUBMISSIONID_INDEX,
        private readonly submissionsAssignmentIdIndex = process.env.SUBMISSIONS_ASSIGNMENTID_INDEX,
        private readonly submissionsStudentIdIndex = process.env.SUBMISSIONS_STUDENTID_INDEX,
        private readonly submissionsInstructorIdIndex = process.env.SUBMISSIONS_INSTRUCTORID_INDEX,
        ) {
    }


    async getAllSubmissionsByAssignmentId(assignmentId: string): Promise<Submission[]> {
        this.logger.info('getAllSubmissionsByAssignmentId')
    
        const result = await this.docClient.query({
          TableName: this.submissionsTable,
          IndexName: this.submissionsAssignmentIdIndex,
          KeyConditionExpression: 'assignmentId = :assignmentId',
          ExpressionAttributeValues: {
              ':assignmentId': assignmentId
          },
          ScanIndexForward: false
        }).promise()
    
        const items = result.Items
        return items as Submission[]
    }

    async getAllSubmissionsByStudentId(studentId: string): Promise<Submission[]> {
        this.logger.info('getAllSubmissionsByStudentId')
    
        const result = await this.docClient.query({
          TableName: this.submissionsTable,
          IndexName: this.submissionsStudentIdIndex,
          KeyConditionExpression: 'studentId = :studentId',
          ExpressionAttributeValues: {
              ':studentId': studentId
          },
          ScanIndexForward: false
        }).promise()
    
        const items = result.Items
        return items as Submission[]
    }

    async getAllSubmissionsByInstructorId(instructorId: string): Promise<Submission[]> {
      this.logger.info('getAllSubmissionsByInstructorId')
  
      const result = await this.docClient.query({
        TableName: this.submissionsTable,
        IndexName: this.submissionsInstructorIdIndex,
        KeyConditionExpression: 'instructorId = :instructorId',
        ExpressionAttributeValues: {
            ':instructorId': instructorId
        },
        ScanIndexForward: false
      }).promise()
  
      const items = result.Items
      return items as Submission[]
    }

    async getSubmissionBySubmissionId( submissionId: string ) : Promise<Submission> {

      this.logger.info('getSubmissionBySubmissionId')
      const result = await this.docClient.query({
        TableName: this.submissionsTable,
        IndexName: this.submissionsSubmissionIdIndex,
        KeyConditionExpression: 'submissionId = :submissionId',
        ExpressionAttributeValues: {
            ':submissionId': submissionId
        },
        ScanIndexForward: false
      }).promise()
  
      if (result.Count !== 0) { 
        const item = result.Items[0]
        return item as Submission
      } else {
          return undefined
      }
    }

    async createSubmission(submission: Submission): Promise<Submission> {

        this.logger.info('createSubmission: ' + JSON.stringify(submission) )    
        await this.docClient.put({
          TableName: this.submissionsTable,
          Item: submission
        }).promise()
    
        return submission
    }

    // may need to add submissionId to the GlobalSecondaryIndexes
    async updateSubmissionFromUser(submission: Submission): Promise<Submission> {

        this.logger.info('updating Submission: ' + JSON.stringify(submission) )
    
        let updateInstructorComments = '';
        let updateStudentScore = '';
        let updateStudentReferences = '';
                
        let expressionAttributeValues = new Object();

        if ( submission.instructorComments !== undefined ) {
          updateInstructorComments = ' instructorComments = :instructorComments '
          expressionAttributeValues[":instructorComments"] = submission.instructorComments
        }
        if ( submission.studentScore !== undefined ) {
          updateStudentScore = ' studentScore = :studentScore '
          expressionAttributeValues[":studentScore"] = submission.studentScore
        }
        if ( submission.studentReferences !== undefined ) {
          updateStudentReferences = ' studentReferences = :studentReferences '
          expressionAttributeValues[":studentReferences"] = submission.studentReferences
        }

        let updateExpression = '';
        if ( updateInstructorComments.length > 0) {
          updateExpression += updateInstructorComments
        }
        if ( updateStudentScore.length > 0) {
          if ( updateExpression.length > 0 ) {
            updateExpression += ','
          }
          updateExpression += updateStudentScore
        }
        if ( updateStudentReferences.length > 0) {
          if ( updateExpression.length > 0 ) {
            updateExpression += ','
          }
          updateExpression += updateStudentReferences
        }       

        this.logger.info( JSON.stringify( submission ));
        


        if ( updateExpression.length == 0) {
          return submission
        } else {
          updateExpression = ' set ' + updateExpression
        }
        
        this.logger.info( updateExpression );
        this.logger.info( JSON.stringify( expressionAttributeValues ));

        await this.docClient.update({
          TableName: this.submissionsTable,
          Key: {
            submissionId: submission.submissionId,
            createdAt: submission.createdAt
          },         
          UpdateExpression: updateExpression,
          ExpressionAttributeValues: expressionAttributeValues
        }).promise()
    
        return submission
    }

    // may need to add submissionId to the GlobalSecondaryIndexes
    async deleteSubmission(submission: Submission ): Promise<Submission> {

        this.logger.info(`deleteSubmission with submissionId:${submission.submissionId}`)
        const data = await this.docClient.delete({
          TableName: this.submissionsTable,
          Key: {
            submissionId: submission.submissionId,
            createdAt: submission.createdAt
          }
        }).promise()
    
        this.logger.info("Delete submission successful:", JSON.stringify(data) );
        return submission;
    }
}