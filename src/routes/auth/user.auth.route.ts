import express from 'express'
import { meHandler } from '../../controller/users.controller'
import authenticationMiddleWare from '../../middleware/auth.middleware'
import { Context } from '../../db'

export default (ctx: Context) => {
  const userAuthRoute = express.Router()
  //Authentication middleware to check token

  userAuthRoute.use(authenticationMiddleWare(ctx))

  //User related Routes
  userAuthRoute.get('/me', meHandler(ctx))
  return userAuthRoute
}
