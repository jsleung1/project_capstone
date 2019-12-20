import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { Course } from '../entities/Course';

const XAWS = AWSXRay.captureAWS(AWS)

export class CourseAccess {

    private logger = createLogger('CourseAccess')

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly coursesTable = process.env.COURSES_TABLE,
        private readonly coursesCourseIdIndex = process.env.COURSES_COURSEID_INDEX,
        private readonly coursesInstructorIdIndex = process.env.COURSES_INSTRUCTORID_INDEX,
        private readonly coursesAcadYearIndex = process.env.COURSES_ACADYEAR_INDEX,
        private readonly coursesCourseCodeIndex = process.env.COURSES_COURSECODE_INDEX,
      ) {
    }

    async getAllCoursesByAcadYear(acadYear: number): Promise<Course[]> {
      this.logger.info('getAllCoursesByAcadYear')
  
      const result = await this.docClient.query({
        TableName: this.coursesTable,
        IndexName: this.coursesAcadYearIndex,
        KeyConditionExpression: 'acadYear = :acadYear',
        ExpressionAttributeValues: {
            ':acadYear': acadYear
        },
        ScanIndexForward: false
      }).promise()
  
      const items = result.Items
      return items as Course[]
    }

    async getAllCoursesByInstructorId(instructorId: string): Promise<Course[]> {
        this.logger.info('getAllCoursesByInstructorId')
    
        const result = await this.docClient.query({
          TableName: this.coursesTable,
          IndexName: this.coursesInstructorIdIndex,
          KeyConditionExpression: 'instructorId = :instructorId',
          ExpressionAttributeValues: {
              ':instructorId': instructorId
          },
          ScanIndexForward: false  
        }).promise()
    
        const items = result.Items
        return items as Course[]
    }
    

    async getCourseByCourseId(courseId: string): Promise<Course> {
        
        this.logger.info('getCourseByCourseId')
        const result = await this.docClient.query({
            TableName: this.coursesTable,
            IndexName: this.coursesCourseIdIndex,
            KeyConditionExpression: 'courseId = :courseId',
            ExpressionAttributeValues: {
                ':courseId': courseId
            },
            ScanIndexForward: false   
        }).promise()

        if (result.Count !== 0) { 
            const item = result.Items[0]
            return item as Course
        } else {
            return undefined
        }
    }
    
    async getCoursesByCourseCode(courseCode: string): Promise<Course[]> {
        
      this.logger.info('getCoursesByCourseCode')
      const result = await this.docClient.query({
          TableName: this.coursesTable,
          IndexName: this.coursesCourseCodeIndex,
          KeyConditionExpression: 'courseCode = :courseCode',
          ExpressionAttributeValues: {
              ':courseCode': courseCode
          },
          ScanIndexForward: false      
      }).promise()

      const items = result.Items
      return items as Course[]
  }

    async createCourse(course: Course): Promise<Course> {

        this.logger.info('createCourse: ' + JSON.stringify(course) )    
        await this.docClient.put({
          TableName: this.coursesTable,
          Item: course
        }).promise()
    
        return course
    }

    async updateCourse(course: Course): Promise<Course> {

        this.logger.info('updating Course: ' + JSON.stringify(course) )
    
        await this.docClient.update({
          TableName: this.coursesTable,
          Key: {
            courseId: course.courseId,
            createdAt: course.createdAt
          },         
          UpdateExpression: 'set courseDescription = :courseDescription',
          ExpressionAttributeValues: {
            ':courseDescription': course.courseDescription
          }
        }).promise()
    
        return course
    }


    async deleteCourse(course: Course ): Promise<Course> {

        this.logger.info(`deleteCourse with courseId:${course.courseId}`)
        const data = await this.docClient.delete({
          TableName: this.coursesTable,
          Key: {
            courseId: course.courseId,
            createdAt: course.createdAt
          },
        }).promise()
    
        this.logger.info("Delete course successful:", JSON.stringify(data) );
        return course;
    }
}