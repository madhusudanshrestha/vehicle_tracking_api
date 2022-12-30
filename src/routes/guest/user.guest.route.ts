import express from 'express'
import {
  createUserHandler,
  loginUserHandler
} from '../../controller/users.controller'
import multipartMiddleware from '../../middleware/multer.middlerware'
import verifySchemaMiddleware from '../../middleware/verifySchema.middleware'
import { UserLoginModel, UserModel } from '../../schema'
import { Context } from '../../db'
export default (ctx: Context) => {
  const userGuestRoute = express.Router()
  //User routes
  userGuestRoute.post(
    '/create',
    multipartMiddleware.single('profilePicture'),
    verifySchemaMiddleware(UserModel),
    createUserHandler(ctx)
  )
  userGuestRoute.post(
    '/login',
    verifySchemaMiddleware(UserLoginModel),
    loginUserHandler(ctx)
  )
  return userGuestRoute
}
