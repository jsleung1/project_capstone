import { AssignmentAccess } from './../dataLayer/assignmentAccess';
import * as uuid from 'uuid'

import { createLogger } from '../utils/logger';
import { CreateCourseRequest } from '../requests/course/CreateCourseRequest';
import { Course } from '../entities/Course';
import { CourseAccess } from '../dataLayer/courseAccess';
import { UserAccess } from '../dataLayer/userAccess';
import { UpdateCourseRequest } from '../requests/course/UpdateCourseRequest';
import { Instructor, Student } from '../entities/User';

const logger = createLogger('courseService')

const courseAccess = new CourseAccess()
const assignmentAccess = new AssignmentAccess()
const userAccess = new UserAccess()

// get Course by course Id (work for all users of instructor or student, no need to check for userType)
export async function getCourseByCourseId( courseId: string ): Promise<Course> {
  return await courseAccess.getCourseByCourseId(courseId)
}

// get Courses for instructor, or for student (which use acadYear to query for student courses)
export async function getCoursesForInstructorOrStudent(userId: string, acadYear: string): Promise<Course[]> {
  const user = await userAccess.getUserByUserId(userId)
  if ( !user ) {
    throw new Error(`Cannot find user to return the corresponding courses`)
  }

  if ( user.userType === Student) {
    if ( acadYear) {
      return await courseAccess.getAllCoursesByAcadYear( Number(acadYear) );
    } else {
      throw new Error(`Cannot get courses for student with missing parameter for acadYear`)
    }
  }
  
  if ( user.userType === Instructor) {
    if ( acadYear ) {
      const coursesByAcadYear = await courseAccess.getAllCoursesByAcadYear( Number(acadYear) )
      const instructorCoursesByAcadYear = coursesByAcadYear.filter( s => s.instructorId === userId )
      return instructorCoursesByAcadYear;
    } else {
      return await courseAccess.getAllCoursesByInstructorId(userId);
    }
  }
  throw new Error(`Cannot get the courses with invalid userType`) 
}

export async function getInstructorCourses( instructorId: string, acadYear: string): Promise<Course[]> {
  const coursesByAcadYear = await courseAccess.getAllCoursesByAcadYear( Number(acadYear) )
  const instructorCoursesByAcadYear = coursesByAcadYear.filter( s => s.instructorId === instructorId )
  return instructorCoursesByAcadYear;
}

export async function createCourse( createCourseRequest: CreateCourseRequest, instructorId: string): Promise<Course> {
  
  const instructorUser = await userAccess.getUserByUserIdAndUserType(instructorId, Instructor)
  if ( !instructorUser ) {
    throw new Error(`Invalid user to create the course`)
  }

  const existingCourses = await courseAccess.getCoursesByCourseName( createCourseRequest.courseName)
  const existCourseInAcadYear = existingCourses.find( s => s.acadYear === createCourseRequest.acadYear)

  if ( existCourseInAcadYear ) {
    throw new Error(`A course with the same name (${createCourseRequest.courseName}) under the same term (${createCourseRequest.acadYear}) already exists!`)
  }

  const courseId: string = uuid.v4()

  const savedCourse = await courseAccess.createCourse({
    courseId,
    instructorId,
    createdAt: new Date().toISOString(),
    acadYear: createCourseRequest.acadYear,
    courseName: createCourseRequest.courseName,
    courseDescription: createCourseRequest.courseDescription,
    instructorName: instructorUser.userName
  })

  logger.info('Create course successful:' + JSON.stringify( savedCourse ))
  return savedCourse;
   
}
  
export async function updateCourse( updateCourseRequest: UpdateCourseRequest, courseId: string, instructorId: string  ) : Promise<Course> {

  const user = await userAccess.getUserByUserIdAndUserType(instructorId, Instructor)
  if ( !user ) {
    throw new Error(`Invalid user to update the course`)
  }

  const course = await courseAccess.getCourseByCourseId( courseId )
  if ( !course) {
      throw new Error('Cannot find course to update')
  }

  if ( course.instructorId !== instructorId) {
      throw new Error('Cannot update the course because it belongs to another instructor')
  }

  course.courseDescription = updateCourseRequest.courseDescription;
  const updatedCourse = await courseAccess.updateCourse( course )
  return updatedCourse;
}

export async function deleteCourse( courseId: string, instructorId: string ): Promise<Course> {

  const user = await userAccess.getUserByUserIdAndUserType(instructorId, Instructor)
  if ( !user ) {
    throw new Error(`Invalid user to delete the course`)
  }

  const course = await courseAccess.getCourseByCourseId( courseId )
  if ( !course) {
      throw new Error('Cannot find course to delete')
  }

  if ( course.instructorId !== instructorId) {
      throw new Error('Cannot delete the course because it belongs to another instructor')
  }

  const assignmentsInCourse = await assignmentAccess.getAllAssignmentsByCourseId( courseId )
  if ( assignmentsInCourse.length > 0) {
      throw new Error('Cannot delete the course because there are existing assigments in the course')
  }

  const deletedCourse = await courseAccess.deleteCourse( course )
  return deletedCourse
}