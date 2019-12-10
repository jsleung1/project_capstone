import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { Assignment } from '../models/Assignment';



export class AssignmentAccess {

    private logger = createLogger('AssignmentAccess')

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly assignmentsTable = process.env.ASSIGNMENTS_TABLE,
        private readonly assignmentsCourseIdIndex = process.env.ASSIGNMENTS_COURSEID_INDEX ) {
    }

    async getAllAssignments(courseId: string): Promise<Assignment[]> {
        this.logger.info('getAllAssignments')
    
        const result = await this.docClient.query({
          TableName: this.assignmentsTable,
          IndexName: this.assignmentsCourseIdIndex,
          KeyConditionExpression: 'courseId = :courseId',
          ExpressionAttributeValues: {
              ':courseId': courseId
          }      
        }).promise()
    
        const items = result.Items
        return items as Assignment[]
    }
    

    async getAssignment(assignmentId: string): Promise<Assignment> {
        
        this.logger.info('getAssignment')
        const result = await this.docClient.query({
            TableName: this.assignmentsTable,
            IndexName: this.assignmentsCourseIdIndex,
            KeyConditionExpression: 'assignmentId = :assignmentId',
            ExpressionAttributeValues: {
                ':assignmentId': assignmentId
            }      
        }).promise()

        if (result.Count !== 0) { 
            const item = result.Items[0]
            return item as Assignment
        } else {
            return undefined
        }
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
          UpdateExpression: 'set assignmentName = :assignmentName, assignmentDescription = :assignmentDescription, dueDate = :dueDate',
          ExpressionAttributeValues: {
            ':assignmentName': assignment.assignmentName,
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