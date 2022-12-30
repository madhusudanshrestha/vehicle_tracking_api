import * as z from 'zod'
import { CompleteVehicle, RelatedVehicleModel } from './index'
import dayjs from 'dayjs'

export const VehicleLocationModel = z.object({
  body: z.object({
    latitude: z.string(),
    longitude: z.string(),
    placeId: z.string().nullish(),
    formattedAddress: z.string().nullish(),
    gpsDeviceId: z.string(),
    vehicleId: z.string().uuid()
  })
})

export const GetVehicleLocationModel = z.object({
  query: z.object({
    from: z
      .string()
      .nullable()
      .transform((it) => (it ? dayjs(it).toISOString() : null)),
    to: z
      .string()
      .nullable()
      .transform((it) => (it ? dayjs(it).toISOString() : null)),
    page: z
      .string()
      .default('0')
      .transform((it) => parseInt(it)),
    perPage: z
      .string()
      .default('10')
      .transform((it) => parseInt(it))
  }),
  params: z.object({
    vehicleId: z.string().uuid()
  })
})

export const GetVehicleLocationPageModel = z.object({
  query: z.object({
    page: z
      .string()
      .default('0')
      .transform((it) => parseInt(it)),
    perPage: z
      .string()
      .default('10')
      .transform((it) => parseInt(it))
  })
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
