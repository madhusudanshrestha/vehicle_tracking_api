import { Vehicle, VehicleLocation } from '@prisma/client'
import { Request, Response } from 'express'
import {
  createLocation,
  getVehicleLocation,
  getVehicleLocationCount
} from '../models/vehicleLocation.models'
import { z } from 'zod'
import {
  createVehicle,
  getAllVehicle,
  getAllVehicleCount,
  getVehicleByNumber,
  updateVehicle
} from '../models/vehicle.models'
import expressAsyncHandler from 'express-async-handler'
import { Context } from '../db'
import { HttpException } from '../exception/http.exception'
import { GetVehicleLocationModel, GetVehicleLocationPageModel } from '../schema'

/**
 *  Register a vehicle
 * @param ctx Database Context
 * @returns
 */
export const registerHandler = (ctx: Context) =>
  expressAsyncHandler(
    async (req: Request<object, object, Vehicle>, res: Response) => {
      const { vehicleNumber } = req.body
      req.body.userId = req.user.id
      if ((await getVehicleByNumber(ctx, vehicleNumber)) == null)
        res.status(201).send({ data: await createVehicle(ctx, req.body) })
      else throw new HttpException(400, 'Vehicle already registered')
    }
  )
/**
 * Update a vehicle
 * @param ctx Database context
 * @returns
 */
export const updateHandler = (ctx: Context) =>
  expressAsyncHandler(
    async (req: Request<object, object, Vehicle>, res: Response) => {
      const vehicle: Vehicle = req.body
      vehicle.userId = req.user.id
      res.status(201).send({ data: await updateVehicle(ctx, vehicle) })
    }
  )
/**
 * Get vehicle location
 * @param ctx Database context
 * @returns
 */
export const getLocationHandler = (ctx: Context) =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    const vehicleData: z.infer<typeof GetVehicleLocationModel> =
      GetVehicleLocationModel.parse(req)
    res.status(200).send({
      data: await getVehicleLocation(ctx, vehicleData),
      pagination: {
        page: vehicleData.query.page,
        perPage: vehicleData.query.perPage,
        totalPage: parseInt(
          (
            ((await getVehicleLocationCount(ctx, vehicleData)) - 1) /
            vehicleData.query.perPage
          ).toString()
        )
      }
    })
  })

/**
 * Update vehicle location
 * @param ctx Database context
 * @returns
 */
export const updateLocationHandler = (ctx: Context) =>
  expressAsyncHandler(
    async (req: Request<object, object, VehicleLocation>, res: Response) => {
      const locationData = req.body
      res
        .status(201)
        .send({ data: await createLocation(ctx, req.user.id, locationData) })
    }
  )

export const getHandler = (ctx: Context) =>
  expressAsyncHandler(async (req: Request, res: Response) => {
    const vehiclePage: z.infer<typeof GetVehicleLocationPageModel> =
      GetVehicleLocationPageModel.parse(req)
    const { page, perPage } = vehiclePage.query
    res.status(200).send({
      data: await getAllVehicle(ctx, page, perPage),
      pagination: {
        page: page,
        perPage: perPage,
        totalPage: parseInt(
          (((await getAllVehicleCount(ctx)) - 1) / perPage).toString()
        )
      }
    })
  })
