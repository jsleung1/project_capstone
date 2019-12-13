import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { updateCourse } from '../../../businessLogic/courseService'
import { parseUserId } from '../../../auth/utils'
import { getJwtToken } from '../../utils'
import { createLogger } from '../../../utils/logger'
import { UpdateCourseRequest } from '../../../requests/course/UpdateCourseRequest';

const logger = createLogger('updateCourseHandler')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', event)
  
  const courseId = event.pathParameters.queryId

  const updateCourseRequest: UpdateCourseRequest = JSON.parse(event.body)
  const jwtToken = getJwtToken( event.headers.Authorization )
  const userId = parseUserId(jwtToken)
  
  let updatedCourse = null

  try {
    updatedCourse = await updateCourse( updateCourseRequest, courseId, userId)
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
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify( updatedCourse )
  }
}