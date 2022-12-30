import express from 'express'
import authenticationMiddleWare from '../../middleware/auth.middleware'
import {
  getHandler,
  getLocationHandler,
  registerHandler,
  updateLocationHandler
} from '../../controller/vehicle.controller'
import checkUserIsAdminMiddleware from '../../middleware/checkUserIsAdmin.middleware'
import { Context } from '../../db'
import {
  VehicleModel,
  VehicleLocationModel,
  GetVehicleLocationModel,
  GetVehicleLocationPageModel
} from '../../schema'
import verifySchemaMiddleware from '../../middleware/verifySchema.middleware'
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
  vehicleAuthRoute.get(
    '/',
    verifySchemaMiddleware(GetVehicleLocationPageModel),
    checkUserIsAdminMiddleware,
    getHandler(ctx)
  )
  vehicleAuthRoute.get(
    '/:vehicleId/location',
    verifySchemaMiddleware(GetVehicleLocationModel),
    checkUserIsAdminMiddleware,
    getLocationHandler(ctx)
  )
  return vehicleAuthRoute
}
