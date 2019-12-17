import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../../utils/logger'
import { getUsersByUserType } from '../../../businessLogic/userService'

const logger = createLogger('getUsersByUserTypeHandler')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', event)
  const userType = event.pathParameters.userType
  
  let users = []
  try {
    users = await getUsersByUserType( userType )
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
    body: JSON.stringify(users)
  }
}
