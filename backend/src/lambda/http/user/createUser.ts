import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { parseUserId, replaceReservedCharacters } from '../../../auth/utils'
import { getJwtToken } from '../../utils'
import { createLogger } from '../../../utils/logger'
import { createUser } from '../../../businessLogic/userService'
import { CreateUserRequest } from '../../../requests/user/CreateUserRequest'

const logger = createLogger('createUserHandler')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', event)
  
  const createUserRequest: CreateUserRequest = JSON.parse(event.body)
  const jwtToken = getJwtToken( event.headers.Authorization )
  const userId = parseUserId(jwtToken)

  let user = null
  try {
    user = await createUser(createUserRequest, userId)
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
    body: JSON.stringify(user)
  }
}

