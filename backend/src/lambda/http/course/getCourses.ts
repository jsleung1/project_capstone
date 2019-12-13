import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { parseUserId } from '../../../auth/utils'
import { getJwtToken } from '../../utils'
import { createLogger } from '../../../utils/logger'
import { getCoursesForInstructorOrStudent } from '../../../businessLogic/courseService'

const logger = createLogger('getCoursesHandler')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', event)
  
  const jwtToken = getJwtToken( event.headers.Authorization )
  const userId = parseUserId(jwtToken)
 
  let acadYear = undefined
  if ( event.pathParameters ) {
    acadYear = event.pathParameters.queryId
  } 

  let courses = []
  try {
    courses = await getCoursesForInstructorOrStudent(userId, acadYear)
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
