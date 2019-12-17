import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../../utils/logger'
import { getInstructorCourses } from '../../../businessLogic/courseService'

const logger = createLogger('getInstructorCoursesHandler')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', event)
  
  let instructorId = event.pathParameters.instructorId
  let acadYear = event.pathParameters.acadYear
  
  let courses = []
  try {
    courses = await getInstructorCourses( instructorId, acadYear )
  } catch (e) {
    logger.error(e.message)
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: e.message
    }
  }
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(courses)
  }
}
