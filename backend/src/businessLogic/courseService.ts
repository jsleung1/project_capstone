import * as uuid from 'uuid'

import { parseUserId } from '../auth/utils';
import { createLogger } from '../utils/logger';
import { CreateCourseRequest } from '../requests/course/CreateCourseRequest';
import { Course } from '../models/Course';
import { CourseAccess } from '../dataLayer/courseAccess';

const logger = createLogger('courseService')

const courseAccess = new CourseAccess()

// get all todos only for that user Id
export async function getAllCoursesForInstructor( jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken)
  return courseAccess.getAllCoursesByInstructorId(userId);
}

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
  