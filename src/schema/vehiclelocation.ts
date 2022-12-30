import * as z from 'zod'
import { CompleteVehicle, RelatedVehicleModel } from './index'

export const VehicleLocationModel = z.object({
  latitude: z.string(),
  longitude: z.string(),
  placeId: z.string().nullish(),
  formattedAddress: z.string().nullish(),
  gpsDeviceId: z.string(),
  vehicleId: z.string().uuid()
})

export const GetVehicleLocationModel = z.object({
  vehicleId: z.string().uuid(),
  from: z.date().nullable(),
  to: z.date().nullable(),
  page: z.number().default(0),
  perPage: z.number().default(10)
})

export interface CompleteVehicleLocation
  extends z.infer<typeof VehicleLocationModel> {
  vehicle: CompleteVehicle
}

/**
 * RelatedVehicleLocationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedVehicleLocationModel: z.ZodSchema<CompleteVehicleLocation> =
  z.lazy(() =>
    VehicleLocationModel.extend({
      vehicle: RelatedVehicleModel
    })
  )
