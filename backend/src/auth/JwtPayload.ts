/**
 * A payload of a JWT token
 */
export interface JwtPayload {
  iss: string
  sub: string // userId
  iat: number
  exp: number
}
