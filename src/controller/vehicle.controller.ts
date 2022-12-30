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
import { GetVehicleLocationModel } from '../schema'
import dayjs from 'dayjs'

/**
 *  Register a vehicle
 * @param ctx Database Context
 * @returns
 */
export const registerHandler = (ctx: Context) =>
  expressAsyncHandler(
    async (req: Request<object, object, Vehicle>, res: Response) => {
      const { vehicleNumber } = req.body
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
      GetVehicleLocationModel.parse({
        vehicleId: req.params.vehicleId,
        from: req.query.from
          ? dayjs(req.query.from as unknown as string).toDate()
          : null,
        to: req.query.to
          ? dayjs(req.query.to as unknown as string).toDate()
          : null,
        page: (req.query.page as unknown as number) ?? 0,
        perPage: (req.query.perPage as unknown as number) ?? 10
      })
    res.status(200).send({
      data: await getVehicleLocation(ctx, vehicleData),
      pagination: {
        page: vehicleData.page,
        perPage: vehicleData.perPage,
        totalPage: parseInt(
          (
            ((await getVehicleLocationCount(ctx, vehicleData)) - 1) /
            vehicleData.perPage
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
    const page = (req.query.page as unknown as number) ?? 0
    const perPage = (req.query.perPage as unknown as number) ?? 10
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
