import * as uuid from 'uuid'

import { createLogger } from '../utils/logger';
import { CreateCourseRequest } from '../requests/course/CreateCourseRequest';
import { Course } from '../models/Course';
import { CourseAccess } from '../dataLayer/courseAccess';
import { UserAccess } from '../dataLayer/userAccess';

const logger = createLogger('courseService')

const courseAccess = new CourseAccess()
const userAccess = new UserAccess()

// get all todos only for that user Id
export async function getAllCoursesByInstructorId( instructorId: string ): Promise<Course[]> {
  return await courseAccess.getAllCoursesByInstructorId(instructorId);
}

export async function getAllCourses( acadYear: number): Promise<Course[]> {
  return await courseAccess.getAllCourses( acadYear );
}

export async function getCourses(userId: string, acadYear: string) {
  const user = await userAccess.getUserByUserId(userId)
  if ( !user ) {
    throw new Error(`Cannot find user to return the corresponding courses`)
  }

  if ( user.userType === 'student') {
    if ( !acadYear) {
      throw new Error(`Cannot get all courses for student with invalid parameter for acadYear`)
    } 

    return courseAccess.getAllCourses( Number(acadYear) );
  }
  
  if ( user.userType === 'instructor') {
    return courseAccess.getAllCoursesByInstructorId(userId);
  }
  throw new Error(`Cannot find courses for invalid userType`) 
}

export async function createCourse(
    createCourseRequest: CreateCourseRequest,
    instructorId: string
  ): Promise<Course> {
  
  const existingCourses = await courseAccess.getCoursesByCourseName( createCourseRequest.courseName)

  const existCourseInAcadYear = existingCourses.find( s => s.acadYear == createCourseRequest.acadYear)

  if ( existCourseInAcadYear ) {
    throw new Error(`A course with the same name: ${createCourseRequest.courseName} under the same term: ${createCourseRequest.acadYear} already exists!`)
  }

  const instructorUser = await userAccess.getUserByUserId(instructorId)
  if ( !instructorUser ) {
    throw new Error(`Cannot find instructor to create the course`)
  }

  const courseId: string = uuid.v4()

  const savedCourse = courseAccess.createCourse({
    courseId,
    instructorId,
    createdAt: new Date().toISOString(),
    acadYear: createCourseRequest.acadYear,
    courseName: createCourseRequest.courseName,
    courseDescription: createCourseRequest.courseDescription,
    instructorName: instructorUser.userName
  })

  logger.info('Create courses successful:' + JSON.stringify( savedCourse ))
  return savedCourse;
   
}
  