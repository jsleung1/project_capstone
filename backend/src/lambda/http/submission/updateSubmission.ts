import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { parseUserId } from '../../../auth/utils'
import { getJwtToken } from '../../utils'
import { createLogger } from '../../../utils/logger'
import { UpdateSubmissionRequest } from '../../../requests/submission/UpdateSubmissionRequest';
import { updateSubmissionForInstructorOrStudent } from '../../../businessLogic/submissionService';

const logger = createLogger('updateSubmissionHandler')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', event)
  
  const submissionId = event.pathParameters.queryId

  const updateSubmissionRequest: UpdateSubmissionRequest = JSON.parse(event.body)
  const jwtToken = getJwtToken( event.headers.Authorization )
  const userId = parseUserId(jwtToken)
  
  let updatedSubmission = null
  // need to do student or instructor update submission
  try {
    updatedSubmission = await updateSubmissionForInstructorOrStudent( updateSubmissionRequest, submissionId, userId)
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
    body: JSON.stringify( updatedSubmission )
  }
}
