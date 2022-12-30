import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import {
  checkUserAuthentication,
  getApiCallWithAuthTest,
  postApiCallWithAuthTest
} from '../index.test'
import { adminUser, clientUser, clientUser2 } from '../data/user'
import { Context, MockContext, createMockContext } from '../../db'
import {
  vehicelExpected,
  vehicle,
  vehicleLocation,
  vehicleLocationExpected
} from '../data/vehicle'
import { zodSchemaError } from '../data/zod'

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = mockCtx as unknown as Context
})

const baseUrl = '/api/v1/vehicle'
describe('Vehicle', () => {
  describe('Vehicle register route', () => {
    checkUserAuthentication(ctx, 'api/v1/vehicle/register')
    describe('given vehicle data with some required fields missing', () => {
      it('should return 500', async () => {
        mockCtx.prisma.user.findFirst.mockResolvedValue(clientUser)
        mockCtx.prisma.vehicle.create.mockResolvedValue(vehicle[0])
        const data = await postApiCallWithAuthTest(
          ctx,
          baseUrl + '/register',
          clientUser,
          {
            gpsDeviceId: uuidv4(),
            createdAt: dayjs().toDate(),
            updatedAt: dayjs().toDate()
          }
        )
        expect(data.statusCode).toBe(500)
        expect(data.body).toEqual(zodSchemaError)
      })
    })
    describe('given vehicle data', () => {
      it('should return vehicle data', async () => {
        mockCtx.prisma.user.findFirst.mockResolvedValue(clientUser)
        mockCtx.prisma.vehicle.create.mockResolvedValue(vehicle[0])
        const data = await postApiCallWithAuthTest(
          ctx,
          baseUrl + '/register',
          clientUser,
          vehicle[0]
        )
        expect(data.statusCode).toBe(201)
        expect(data.body).toEqual({
          data: vehicelExpected[0]
        })
      })
    })
    describe('given vehicle data with bad vehicle number', () => {
      it('should return 500', async () => {
        mockCtx.prisma.user.findFirst.mockResolvedValue(clientUser)
        mockCtx.prisma.vehicle.findFirst.mockResolvedValue(vehicle[0])
        mockCtx.prisma.vehicle.create.mockResolvedValue(vehicle[0])
        const data = await postApiCallWithAuthTest(
          ctx,
          baseUrl + '/register',
          clientUser,
          { ...vehicle[0], vehicleNumber: '1234' }
        )
        expect(data.statusCode).toBe(500)
      })
    })
  })

  describe('Vehicle Get Route', () => {
    checkUserAuthentication(ctx, 'api/v1/vehicle')
    describe('if user logged in and not admin', () => {
      it('should return 403', async () => {
        mockCtx.prisma.user.findFirst.mockResolvedValue(clientUser)
        const data = await getApiCallWithAuthTest(ctx, baseUrl, clientUser)
        expect(data.statusCode).toBe(403)
      })
    })

    describe('if user logged in and is admin', () => {
      it('should return array of registered vehicle', async () => {
        mockCtx.prisma.user.findFirst.mockResolvedValue(adminUser)
        mockCtx.prisma.vehicle.findMany.mockResolvedValue(vehicle)
        const data = await getApiCallWithAuthTest(ctx, baseUrl, adminUser)

        expect(data.statusCode).toBe(200)
        expect(data.body).toEqual({
          data: vehicelExpected,
          pagination: {
            page: 0,
            perPage: 10,
            totalPage: null
          }
        })
      })
    })

    describe('if vehicle list empty', () => {
      it('should return empty array', async () => {
        mockCtx.prisma.user.findFirst.mockResolvedValue(adminUser)
        mockCtx.prisma.vehicle.findMany.mockResolvedValue([])
        const data = await getApiCallWithAuthTest(ctx, baseUrl, adminUser)
        expect(data.statusCode).toBe(200)
        expect(data.body).toEqual({
          data: [],
          pagination: {
            page: 0,
            perPage: 10,
            totalPage: null
          }
        })
      })
    })
  })

  describe('Vehicle location update route', () => {
    checkUserAuthentication(ctx, 'api/v1/vehicle/location/update')
    describe('given vehicle data with some required fields missing', () => {
      it('should return 500', async () => {
        mockCtx.prisma.user.findFirst.mockResolvedValue(clientUser)
        mockCtx.prisma.vehicle.findFirst.mockResolvedValue(vehicle[0])
        mockCtx.prisma.vehicleLocation.create.mockResolvedValue(
          vehicleLocation[0]
        )
        const data = await postApiCallWithAuthTest(
          ctx,
          baseUrl + '/location/update',
          clientUser,
          {
            id: uuidv4(),
            placeId: '',
            formattedAddress: ''
          }
        )
        expect(data.statusCode).toBe(500)
        expect(data.body).toEqual(zodSchemaError)
      })
    })
  })
  describe('given vehicle location data', () => {
    it('should return vehicle location data', async () => {
      mockCtx.prisma.user.findFirst.mockResolvedValue(clientUser)
      mockCtx.prisma.vehicle.findFirst.mockResolvedValue(vehicle[0])
      mockCtx.prisma.vehicleLocation.create.mockResolvedValue(
        vehicleLocation[0]
      )
      const data = await postApiCallWithAuthTest(
        ctx,
        baseUrl + '/location/update',
        clientUser,
        vehicleLocation[0]
      )
      expect(data.statusCode).toBe(201)
      expect(data.body).toEqual({ data: vehicleLocationExpected[0] })
    })
  })
  describe("if user who doesn't own the vehicle try to update another vehicle", () => {
    it('should return 403', async () => {
      mockCtx.prisma.user.findFirst.mockResolvedValue(clientUser2)
      mockCtx.prisma.vehicle.findFirst.mockResolvedValue(vehicle[0])
      mockCtx.prisma.vehicleLocation.create.mockResolvedValue(
        vehicleLocation[0]
      )
      const data = await postApiCallWithAuthTest(
        ctx,
        baseUrl + '/location/update',
        clientUser2,
        vehicleLocation[0]
      )
      expect(data.statusCode).toBe(403)
    })
  })
})

describe('Vehicle location get route', () => {
  checkUserAuthentication(ctx, `api/v1/vehicle/${vehicle[0].id}/location`)
  describe('if vehicle id, from date and to date given', () => {
    it('should return vehicle location data array ', async () => {
      mockCtx.prisma.user.findFirst.mockResolvedValue(adminUser)
      mockCtx.prisma.vehicle.findFirst.mockResolvedValue(vehicle[0])
      mockCtx.prisma.vehicleLocation.findMany.mockResolvedValue(vehicleLocation)
      const data = await getApiCallWithAuthTest(
        ctx,
        baseUrl +
          `/${
            vehicle[0].id
          }/location?from=${vehicle[0].createdAt.toISOString()}&to=${vehicle[0].createdAt.toISOString()}`,
        adminUser
      )
      expect(data.statusCode).toBe(200)
      expect(data.body).toEqual({
        data: vehicleLocationExpected,
        pagination: {
          page: 0,
          perPage: 10,
          totalPage: null
        }
      })
    })
  })
  describe('if user logged in and not admin', () => {
    it('should return 403', async () => {
      mockCtx.prisma.user.findFirst.mockResolvedValue(clientUser)
      const data = await getApiCallWithAuthTest(
        ctx,
        baseUrl +
          `/${
            vehicle[0].id
          }/location?from=${vehicle[0].createdAt.toISOString()}&to=${vehicle[0].createdAt.toISOString()}`,
        clientUser
      )
      expect(data.statusCode).toBe(403)
    })
  })
})
