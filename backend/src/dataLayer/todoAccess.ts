import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../entities/TodoItem'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

export class TodoAccess {

  private logger = createLogger('jwksCert')

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosUserIdIndex = process.env.TODOS_USERID_INDEX,
    private readonly todosTodoIdIndex = process.env.TODOS_TODOID_INDEX,
    ) {
  }

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    this.logger.info('getAllTodos')

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.todosUserIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }      
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async getTodo(todoId: string): Promise<TodoItem> {
    this.logger.info('getTodo')

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.todosTodoIdIndex,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
          ':todoId': todoId
      }      
    }).promise()


    if (result.Count !== 0) { 
      const item = result.Items[0]
      return item as TodoItem
    } else {
      return undefined
    }
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {

    this.logger.info('createTodo: ' + JSON.stringify(todoItem) )

    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()

    return todoItem
  }

  
  async updateTodo(todoItem: TodoItem): Promise<TodoItem> {

    this.logger.info('updating Todo: ' + JSON.stringify(todoItem) )

    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        todoId: todoItem.todoId,
        createdAt: todoItem.createdAt
      },         
      UpdateExpression: 'set #nname = :name, dueDate = :dueDate, done = :done, attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':name': todoItem.name,
        ':dueDate': todoItem.dueDate,
        ':done': todoItem.done,
        ':attachmentUrl': todoItem.attachmentUrl
      },
      ExpressionAttributeNames: {
        '#nname': 'name'
      }
    }).promise()

    return todoItem
  }

  async deleteTodo(todoId: string ): Promise<TodoItem> {

    const todoItem = await this.getTodo( todoId )
    if ( ! todoItem ) {
      this.logger.info(`deleteTodo nothing to delete for todoId:${todoId}`)
      return undefined
    }

    this.logger.info(`deleteTodo with todoId:${todoId}`)
    const data = await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        createdAt: todoItem.createdAt
      }
    }).promise()

    this.logger.info("DeleteItem succeeded:", JSON.stringify(data) );
    return todoItem;
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    this.logger.info('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}