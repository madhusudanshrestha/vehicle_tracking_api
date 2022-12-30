import { Response, Request } from 'express'
import { HttpException } from '../exception/http.exception'
import { getErrorResponse } from '../utils'
import logger from '../logger'
import { NextFunction } from 'connect'
/**
 * Custom error handler for express app
 * @param err
 * @param req
 * @param res
 *
 */
export const errorHandler = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = err.status ?? 500
  res.status(code)
  if (process.env.NODE_ENV !== 'test') {
    logger.error(err.stack)
  }
  res.send({ code: code, message: getErrorResponse(err.message) })
  next()
}
