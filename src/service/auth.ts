import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config'

export interface UserDecoded {
  sub: string
  iat: number
}
/**
 * Hash user password
 * @param password
 * @param salt
 * @returns
 */
async function hashPassword(password: string, salt = 13): Promise<string> {
  return await bcrypt.hash(password, salt)
}
/**
 * Verify user password
 * @param password
 * @param hashedPassword
 * @returns
 */
async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}
/**
 * Generate JWT token
 * @param sub
 * @param iat
 * @returns
 */
function generateToken(sub: string, iat: number = Date.now()): string {
  return jwt.sign({ sub, iat }, config.JWTtoken.secret, {
    expiresIn: config.JWTtoken.expiryTime
  })
}
/**
 * Decode JWT token
 * @param token
 * @returns
 */
function decodeToken(token: string): UserDecoded {
  return jwt.verify(token, config.JWTtoken.secret) as UserDecoded
}

export { hashPassword, verifyPassword, generateToken, decodeToken }
