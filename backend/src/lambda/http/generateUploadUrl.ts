import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getTodo, updateTodo } from '../../businessLogic/todo'

const logger = createLogger('generateUploadUrl')

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = Number( process.env.SIGNED_URL_EXPIRATION )

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  
  const todoItem = await getTodo( todoId )
  if ( ! todoItem ) {

    logger.info(`cannot find todoId:${todoId} to generate upload url`)
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }
  }

  const uploadUrl = getUploadUrl(todoItem.todoId)
  todoItem.attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoItem.todoId}`
  await updateTodo( todoItem )

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}

function getUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
}
