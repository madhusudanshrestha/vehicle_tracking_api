import * as z from 'zod'
import { CompleteVehicle, RelatedVehicleModel } from './index'

export const UserLoginModel = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})
export const UserModel = z.object({
  firstName: z.string(),
  lastName: z.string().nullish(),
  email: z.string().email(),
  password: z.string().min(6)
})

export const UserPasswordModel = z.object({
  password: z.string().regex(RegExp('^$2[ayb]$.{56}$'))
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  Vehicle: CompleteVehicle[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() =>
  UserModel.extend({
    Vehicle: RelatedVehicleModel.array()
  })
)
