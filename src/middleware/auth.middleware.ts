import { Context } from '../db'
import { decodeToken } from '../service/auth'
import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../exception/http.exception'
/**
 * Authenticate bearer token
 *
 * @param req Express request object
 * @param res Express response objext
 * @param next Express nextfunction object
 *
 */
const auth =
  (ctx: Context) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        const token = req.headers.authorization.split(' ')[1]
        const user = await verifyTokenAndGetUser(token, ctx)
        req.user = user //save user to response locals
        next()
      } else {
        next(new HttpException(403, 'Token Invalid'))
      }
    } catch (e: unknown) {
      next(e)
    }
  }

/**
 * Verify token and return the user associated with the token
 * @param token Bearer token
 * @param ctx Database context
 * @returns
 */
const verifyTokenAndGetUser = async (token: string, ctx: Context) => {
  try {
    const decoded = decodeToken(token)
    const user = await ctx.prisma.user.findFirst({
      where: { id: decoded.sub }
    })
    if (user == null) {
      throw new HttpException(404, 'User not found')
    }
    return user
  } catch (error) {
    throw new HttpException(403, 'Invalid Token')
  }
}
export default auth
