import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { parseUserId } from '../../../auth/utils'
import { getJwtToken } from '../../utils'
import { createLogger } from '../../../utils/logger'
import { UpdateAssignmentRequest } from '../../../requests/assignment/UpdateAssignmentRequest';
import { updateAssignment } from '../../../businessLogic/assignmentService';

const logger = createLogger('updateAssignmentHandler')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', event)
  
  const assignmentId = event.pathParameters.queryId

  const updateAssignmentRequest: UpdateAssignmentRequest = JSON.parse(event.body)
  const jwtToken = getJwtToken( event.headers.Authorization )
  const userId = parseUserId(jwtToken)
  
  let updatedAssignment = null

  try {
    updatedAssignment = await updateAssignment( updateAssignmentRequest, assignmentId, userId)
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
    body: JSON.stringify(updatedAssignment)
  }
}