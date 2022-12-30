import express from 'express'
import authenticationMiddleWare from '../../middleware/auth.middleware'
import verifySchemaMiddleware from '../../middleware/verifySchema.middleware'
import {
  getHandler,
  getLocationHandler,
  registerHandler,
  updateLocationHandler
} from '../../controller/vehicle.controller'
import checkUserIsAdminMiddleware from '../../middleware/checkUserIsAdmin.middleware'
import { Context } from '../../db'
import { VehicleModel, VehicleLocationModel } from '../../schema'
export default (ctx: Context) => {
  const vehicleAuthRoute = express.Router()
  //Authentication middleware to check token
  vehicleAuthRoute.use(authenticationMiddleWare(ctx))

  //User and Admin routes
  vehicleAuthRoute.post(
    '/register',
    verifySchemaMiddleware(VehicleModel),
    registerHandler(ctx)
  )
  vehicleAuthRoute.post(
    '/location/update',
    verifySchemaMiddleware(VehicleLocationModel),
    updateLocationHandler(ctx)
  )

  //Admin only routes
  vehicleAuthRoute.get('/', checkUserIsAdminMiddleware, getHandler(ctx))
  vehicleAuthRoute.get(
    '/:vehicleId/location',
    checkUserIsAdminMiddleware,
    getLocationHandler(ctx)
  )
  return vehicleAuthRoute
}
