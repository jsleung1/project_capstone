import * as uuid from 'uuid'

import { parseUserId } from '../auth/utils';
import { createLogger } from '../utils/logger';
import { CreateCourseRequest } from '../requests/course/CreateCourseRequest';
import { Course } from '../models/Course';

const logger = createLogger('courseService')

export async function createCourse(
    createCourseRequest: CreateCourseRequest,
    jwtToken: string
  ): Promise<Course> {
  
    const courseId = uuid.v4()
    const instructorId = parseUserId(jwtToken)
    /*
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
    */
   return null;
  }
  