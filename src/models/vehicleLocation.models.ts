import dayjs from 'dayjs'
import { Context } from '../db'
import { VehicleLocation } from '@prisma/client'
import { z } from 'zod'
import { GetVehicleLocationModel } from '../schema'
import { getVehicleById } from './vehicle.models'
import { HttpException } from '../exception/http.exception'

/**
 * Create new location of a registered vehicle
 * @param ctx Database context
 * @param userId the user who is registering new location of the vehicle
 * @param locationData the VehicleLocation object model
 * @returns
 */
export const createLocation = async (
  ctx: Context,
  userId: string,
  locationData: VehicleLocation
) => {
  const vehicleData = await getVehicleById(ctx, locationData.vehicleId)
  if (vehicleData == null) throw new HttpException(404, 'Vehicle not found')
  if (vehicleData.userId != userId)
    throw new HttpException(
      403,
      'Unauthorized to record location for this vehicle'
    )
  if (vehicleData.gpsDeviceId != locationData.gpsDeviceId)
    throw new HttpException(403, 'Unknown GPS device for vehicle')
  return await ctx.prisma.vehicleLocation.create({
    data: {
      ...locationData,
      createdAt: dayjs().toDate()
    }
  })
}
/**
 * Get a vehicle registered location
 * @param ctx Database context
 * @param vehicleData the GetVehicleLocationModel object model
 * @returns
 */
export const getVehicleLocation = async (
  ctx: Context,
  vehicleData: z.infer<typeof GetVehicleLocationModel>
) => {
  const { perPage, page, vehicleId, from, to } = vehicleData
  if ((await getVehicleById(ctx, vehicleData.vehicleId)) == null)
    throw new HttpException(404, 'Vehicle not found')
  return await ctx.prisma.vehicleLocation.findMany({
    where: {
      vehicleId: vehicleId,
      createdAt:
        to && from
          ? {
              gte: from.toISOString(),
              lte: to.toISOString()
            }
          : {}
    },
    orderBy: { createdAt: 'desc' },
    take: perPage,
    skip: page * perPage
  })
}
/**
 * Count of a vehicle registered location
 * @param ctx Database context
 * @param vehicleData the GetVehicleLocationModel object model
 * @returns
 */
export const getVehicleLocationCount = async (
  ctx: Context,
  vehicleData: z.infer<typeof GetVehicleLocationModel>
) => {
  const { to, from, vehicleId } = vehicleData
  return await ctx.prisma.vehicleLocation.count({
    where: {
      vehicleId: vehicleId,
      createdAt:
        to && from
          ? {
              gte: from.toISOString(),
              lte: to.toISOString()
            }
          : {}
    }
  })
}
