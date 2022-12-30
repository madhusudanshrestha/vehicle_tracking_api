import { NextFunction, Request, Response } from 'express'
import { Schema } from 'zod'

/**
 * Verify schema using zod and save data to response locals
 */
export default (schema: Schema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (err) {
      next(err)
    }
  }
