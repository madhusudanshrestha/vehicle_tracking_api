import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import { clientUser, clientUser2 } from './user'

export const vehicle = [
  {
    id: uuidv4(),
    userId: clientUser.id,
    vehicleNumber: '1FTYR10U15PB12080',
    gpsDeviceId: uuidv4(),
    createdAt: dayjs().toDate(),
    updatedAt: dayjs().toDate()
  },
  {
    id: uuidv4(),
    userId: clientUser2.id,
    vehicleNumber: '1FTYR10U15PB12081',
    gpsDeviceId: uuidv4(),
    createdAt: dayjs().toDate(),
    updatedAt: dayjs().toDate()
  }
]

export const vehicelExpected = [
  {
    ...vehicle[0],
    createdAt: expect.any(String),
    updatedAt: expect.any(String)
  },
  {
    ...vehicle[1],
    createdAt: expect.any(String),
    updatedAt: expect.any(String)
  }
]

export const vehicleLocation = [
  {
    id: uuidv4(),
    latitude: new Prisma.Decimal(15.87),
    longitude: new Prisma.Decimal(100.9925),
    placeId: '',
    gpsDeviceId: vehicle[0].gpsDeviceId,
    formattedAddress: '',
    createdAt: dayjs().toDate(),
    updatedAt: dayjs().toDate(),
    vehicleId: vehicle[0].id
  },
  {
    id: uuidv4(),
    latitude: new Prisma.Decimal(15.87),
    longitude: new Prisma.Decimal(100.9925),
    placeId: '',
    gpsDeviceId: vehicle[1].gpsDeviceId,
    formattedAddress: '',
    createdAt: dayjs().toDate(),
    updatedAt: dayjs().toDate(),
    vehicleId: vehicle[1].id
  },
  {
    id: uuidv4(),
    latitude: new Prisma.Decimal(15.87),
    longitude: new Prisma.Decimal(100.9925),
    placeId: '',
    gpsDeviceId: vehicle[0].gpsDeviceId,
    formattedAddress: '',
    createdAt: dayjs().toDate(),
    updatedAt: dayjs().toDate(),
    vehicleId: vehicle[0].id
  },
  {
    id: uuidv4(),
    latitude: new Prisma.Decimal(15.87),
    longitude: new Prisma.Decimal(100.9925),
    placeId: '',
    gpsDeviceId: vehicle[1].gpsDeviceId,
    formattedAddress: '',
    createdAt: dayjs().toDate(),
    updatedAt: dayjs().toDate(),
    vehicleId: vehicle[1].id
  }
]

export const vehicleLocationExpected = [
  {
    ...vehicleLocation[0],
    latitude: vehicleLocation[0].latitude.toString(),
    longitude: vehicleLocation[0].longitude.toString(),
    createdAt: expect.any(String),
    updatedAt: expect.any(String)
  },
  {
    ...vehicleLocation[1],
    latitude: vehicleLocation[1].latitude.toString(),
    longitude: vehicleLocation[1].longitude.toString(),
    createdAt: expect.any(String),
    updatedAt: expect.any(String)
  },
  {
    ...vehicleLocation[2],
    latitude: vehicleLocation[2].latitude.toString(),
    longitude: vehicleLocation[2].longitude.toString(),
    createdAt: expect.any(String),
    updatedAt: expect.any(String)
  },
  {
    ...vehicleLocation[3],
    latitude: vehicleLocation[3].latitude.toString(),
    longitude: vehicleLocation[3].longitude.toString(),
    createdAt: expect.any(String),
    updatedAt: expect.any(String)
  }
]
