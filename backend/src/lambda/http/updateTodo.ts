import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getTodo, updateTodo } from '../../businessLogic/todo'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const todoId = event.pathParameters.todoId
  const toUpdateDo: UpdateTodoRequest = JSON.parse(event.body)

  const existToDo = await getTodo(todoId)
  if (! existToDo) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }    
  }

  existToDo.name = toUpdateDo.name
  existToDo.dueDate = toUpdateDo.dueDate
  existToDo.done = toUpdateDo.done

  const updatedToDo = await updateTodo(existToDo)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: updatedToDo
    })
  } 
}
