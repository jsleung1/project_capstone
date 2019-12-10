import { createLogger } from '../utils/logger';

import { UserAccess } from '../dataLayer/userAccess';
import { User } from '../models/User';
import { CreateUserRequest } from '../requests/user/CreateUserRequest';

const logger = createLogger('userService')

const userAccess = new UserAccess()

export async function createUser(
    createUserRequest: CreateUserRequest,
    userId: string
  ): Promise<User> {
  
  const existingUser = await userAccess.getUserByUserId( userId )
  if ( existingUser ) {
    throw new Error('User already registered in the system!')
  }

  const existingUserWithSameEmail = await userAccess.getUserByEmail( createUserRequest.email )
  if ( existingUserWithSameEmail ) {
    throw new Error('An existing user already registered with the same email')
  }

  const savedUser = userAccess.createUser({
    userId,
    createdAt: new Date().toISOString(),
    userType: createUserRequest.userType,
    email: createUserRequest.email,
    userName: createUserRequest.userName
  })

  logger.info('Create user successful:' + JSON.stringify( savedUser ))
  return savedUser;
   
}

export async function getUser(userId: string): Promise<User> {
    return await userAccess.getUserByUserId(userId);
}