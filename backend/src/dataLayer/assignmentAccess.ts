import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { Assignment } from '../entities/Assignment';

const XAWS = AWSXRay.captureAWS(AWS)

export class AssignmentAccess {

    private logger = createLogger('AssignmentAccess')

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly assignmentsTable = process.env.ASSIGNMENTS_TABLE,
        private readonly assigmentsAssigmentIdIndex = process.env.ASSIGNMENTS_ASSIGNMENTID_INDEX,
        private readonly assignmentsCourseIdIndex = process.env.ASSIGNMENTS_COURSEID_INDEX,
        private readonly assignmentsAssignmentNameIndex = process.env.ASSIGNMENTS_ASSIGNMENTNAME_INDEX ) {
    }

    async getAllAssignmentsByCourseId(courseId: string): Promise<Assignment[]> {
        this.logger.info('getAllAssignmentsByCourseId')
    
        const result = await this.docClient.query({
          TableName: this.assignmentsTable,
          IndexName: this.assignmentsCourseIdIndex,
          KeyConditionExpression: 'courseId = :courseId',
          ExpressionAttributeValues: {
              ':courseId': courseId
          },
          ScanIndexForward: false
        }).promise()
    
        const items = result.Items
        return items as Assignment[]
    }
    

    async getAssignmentByAssignmentId(assignmentId: string): Promise<Assignment> {
        
      this.logger.info('getAssignmentByAssignmentId')
      const result = await this.docClient.query({
          TableName: this.assignmentsTable,
          IndexName: this.assigmentsAssigmentIdIndex,
          KeyConditionExpression: 'assignmentId = :assignmentId',
          ExpressionAttributeValues: {
              ':assignmentId': assignmentId
          },
          ScanIndexForward: false 
      }).promise()

      if (result.Count !== 0) { 
          const item = result.Items[0]
          return item as Assignment
      } else {
          return undefined
      }
    }

    async getAssignmentByAssigmentId(assignmentId: string): Promise<Assignment> {
        
        this.logger.info('getAssignmentByAssigmentId')
        const result = await this.docClient.query({
            TableName: this.assignmentsTable,
            IndexName: this.assigmentsAssigmentIdIndex,
            KeyConditionExpression: 'assignmentId = :assignmentId',
            ExpressionAttributeValues: {
                ':assignmentId': assignmentId
            },
            ScanIndexForward: false
        }).promise()

        if (result.Count !== 0) { 
            const item = result.Items[0]
            return item as Assignment
        } else {
            return undefined
        }
    }

    async getAssignmentsByAssigmentName(assignmentName: string): Promise<Assignment[]> {
        
      this.logger.info('getAssignmentByAssigmentName')
      const result = await this.docClient.query({
          TableName: this.assignmentsTable,
          IndexName: this.assignmentsAssignmentNameIndex,
          KeyConditionExpression: 'assignmentName = :assignmentName',
          ExpressionAttributeValues: {
              ':assignmentName': assignmentName
          },
          ScanIndexForward: false
      }).promise()

      const items = result.Items
      return items as Assignment[]
  }

    async createAssignment(assignment: Assignment): Promise<Assignment> {

        this.logger.info('createAssignment: ' + JSON.stringify(assignment) )    
        await this.docClient.put({
          TableName: this.assignmentsTable,
          Item: assignment
        }).promise()
    
        return assignment
    }

    async updateAssignment(assignment: Assignment): Promise<Assignment> {

        this.logger.info('updating Assignment: ' + JSON.stringify(assignment) )
    
        await this.docClient.update({
          TableName: this.assignmentsTable,
          Key: {
            assignmentId: assignment.assignmentId,
            createdAt: assignment.createdAt
          },         
          UpdateExpression: 'set assignmentDescription = :assignmentDescription, dueDate = :dueDate',
          ExpressionAttributeValues: {
            ':assignmentDescription': assignment.assignmentDescription,
            ':dueDate': assignment.dueDate
          }
        }).promise()
    
        return assignment
    }


    async deleteAssignment(assignment: Assignment ): Promise<Assignment> {

        this.logger.info(`deleteAssignment with assignmentId:${assignment.assignmentId}`)
        const data = await this.docClient.delete({
          TableName: this.assignmentsTable,
          Key: {
            assignmentId: assignment.assignmentId,
            createdAt: assignment.createdAt
          }
        }).promise()
    
        this.logger.info("Delete assignment successful:", JSON.stringify(data) );
        return assignment;
    }
}