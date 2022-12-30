import * as z from 'zod'
import {
  CompleteUser,
  RelatedUserModel,
  CompleteVehicleLocation,
  RelatedVehicleLocationModel
} from './index'

export const VehicleModel = z.object({
  body: z.object({
    vehicleNumber: z.string().regex(RegExp('[(A-H|J-N|P|R-Z|0-9)]{17}')), //TODO Regex
    gpsDeviceId: z.string()
  })
})

export interface CompleteVehicle extends z.infer<typeof VehicleModel> {
  user: CompleteUser
  Location: CompleteVehicleLocation[]
}

/**
 * RelatedVehicleModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedVehicleModel: z.ZodSchema<CompleteVehicle> = z.lazy(() =>
  VehicleModel.extend({
    user: RelatedUserModel,
    Location: RelatedVehicleLocationModel.array()
  })
)
