import { Vehicle } from '@prisma/client'
import { Context } from '../db'

/**
 * Create new vehicle
 * @param ctx Database context
 * @param vehicleData the vehicle object model
 * @returns
 */
export const createVehicle = async (ctx: Context, vehicleData: Vehicle) => {
  return await ctx.prisma.vehicle.create({ data: vehicleData })
}
/**
 * Update existing vehicle
 * @param ctx Database context
 * @param vehicleData the vehicle object model
 * @returns
 */
export const updateVehicle = async (ctx: Context, vehicleData: Vehicle) => {
  const { id, userId, gpsDeviceId } = vehicleData
  return await ctx.prisma.vehicle.update({
    where: {
      id: id,
      id_userId: {
        id: id,
        userId: userId
      }
    },
    data: {
      gpsDeviceId: gpsDeviceId
    }
  })
}
/**
 * Get all registered vehicle
 * @param ctx Database context
 * @param offset the offset for the database skip
 * @param size the size of the data to take
 * @returns
 */
export const getAllVehicle = async (
  ctx: Context,
  offset: number,
  size = 10
) => {
  size = size ?? 10
  offset = offset ?? 0
  return await ctx.prisma.vehicle.findMany({
    take: size,
    skip: offset * size
  })
}
/**
 * Count of all registered vehicle
 * @param ctx Database context
 * @returns
 */
export const getAllVehicleCount = async (ctx: Context) => {
  return await ctx.prisma.vehicle.count()
}
/**
 * Get vehicle via vehicle identification number
 * @param ctx Database context
 * @param number Vehicle Identification number
 * @returns
 */
export const getVehicleByNumber = async (ctx: Context, number: string) => {
  return await ctx.prisma.vehicle.findFirst({
    where: { vehicleNumber: number }
  })
}
/**
 * Get vehicle via vehicle id
 * @param ctx Database context
 * @param id vehicle UUID in string
 * @returns
 */
export const getVehicleById = async (ctx: Context, id: string) => {
  return await ctx.prisma.vehicle.findFirst({
    where: { id: id }
  })
}
