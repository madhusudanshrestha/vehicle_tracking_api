import { createPrismaContext } from '../../db'
import { adminUser, clientUser2, clientUser3 } from '../data/user'
import { vehicle, vehicleLocation } from '../data/vehicle'
import userTest from './user.test'
import vehicleTest from './vehicle.test'

const prismaContext = createPrismaContext()
const prisma = prismaContext.prisma
beforeAll(async () => {
  // create product categories
  await prisma.user.createMany({
    data: [clientUser2, adminUser, clientUser3]
  })
  await prisma.vehicle.createMany({
    data: [vehicle[1]]
  })
  await prisma.vehicleLocation.createMany({
    data: [vehicleLocation[1], vehicleLocation[3]]
  })
})

afterAll(async () => {
  const deleteVehicleLocation = prisma.vehicleLocation.deleteMany()
  const deleteVehicle = prisma.vehicle.deleteMany()
  const deleteUser = prisma.user.deleteMany()
  await prisma.$transaction([deleteVehicleLocation, deleteVehicle, deleteUser])
  await prisma.$disconnect()
})

describe('test', () => {
  ;(() => userTest(prismaContext))()
  ;(() => vehicleTest(prismaContext))()
})
