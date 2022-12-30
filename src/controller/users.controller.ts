import { Request, Response } from 'express'
import {
  userCreate,
  findUserByEmail,
  findUserById
} from '../models/user.models'
import { User } from '@prisma/client'
import { generateToken, verifyPassword } from '../service/auth'
import config from '../config'
import { saveImage } from '../service/image'
import { UserLoginModel } from '../schema'
import { z } from 'zod'
import expressAsyncHandler from 'express-async-handler'
import { HttpException } from '../exception/http.exception'
import { Context } from '../db'
import _ from 'lodash'
/**
 * Get logged in user info
 * @param req
 * @param res
 */

export const meHandler = (ctx: Context) =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await findUserById(ctx, req.user.id)
    res.status(200).json({ data: _.omit(user, 'password') })
  })
/**
 * Create new user
 * @param req
 * @param res
 */
export const createUserHandler = (ctx: Context) =>
  expressAsyncHandler(
    async (req: Request<object, object, User>, res: Response) => {
      const user = req.body
      const file = req.file
      if (file) {
        user.profilePicture = saveImage(file)
      }
      const userData = await userCreate(ctx, user)
      res.status(201).json({ data: _.omit(userData, 'password') })
    }
  )
/**
 * Login in user
 * @param req
 * @param res
 */
export const loginUserHandler = (ctx: Context) =>
  expressAsyncHandler(
    async (
      req: Request<object, object, z.infer<typeof UserLoginModel>>,
      res: Response
    ) => {
      const { email, password } = req.body
      const user = await findUserByEmail(ctx, email)
      if (await verifyPassword(password, user.password)) {
        res.status(200).json({
          data: {
            token: generateToken(user.id),
            expiresIn: config.JWTtoken.expiryTime as number
          }
        })
      } else {
        throw new HttpException(409, 'Invalid Username/Password')
      }
    }
  )
