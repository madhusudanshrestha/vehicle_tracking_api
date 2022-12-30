import { NextFunction, Request, Response } from 'express'
import { HttpException } from '../exception/http.exception'
/**
 * Middleware to check if user is an admin
 */
export default (req: Request, res: Response, next: NextFunction) => {
  req.user?.isAdmin
    ? next()
    : next(new HttpException(403, 'Unauthorized user. Admin route.'))
}
