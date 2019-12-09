import * as uuid from 'uuid'

import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodoAccess } from '../dataLayer/todoAccess'
import { TodoItem } from '../models/TodoItem';
import { parseUserId } from '../auth/utils';
import { createLogger } from '../utils/logger';

const logger = createLogger('todo')

const todoAccess = new TodoAccess()

// get all todos only for that user Id
export async function getAllTodos( jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken)

  return todoAccess.getAllTodos(userId);
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const todoId = uuid.v4()
  const userId = parseUserId(jwtToken)

  const savedToDoItem = await todoAccess.createTodo({
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    attachmentUrl: null
  })
  logger.info(JSON.stringify( savedToDoItem ))
  return savedToDoItem;
}

export async function getTodo(todoId: string): Promise<TodoItem> {
  return await todoAccess.getTodo(todoId)
}

export async function updateTodo(todoItem: TodoItem): Promise<TodoItem> {
  return await todoAccess.updateTodo(todoItem)
}

export async function deleteTodo(todoId: string): Promise<TodoItem> {
  return await todoAccess.deleteTodo(todoId)
}