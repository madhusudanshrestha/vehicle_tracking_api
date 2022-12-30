import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import {
  checkUserAuthentication,
  getApiCallWithAuthTest,
  postApiCallWithAuthTest
} from '../index.test'
import { adminUser, clientUser, clientUser2, clientUser3 } from '../data/user'
import { Context } from '../../db'
import {
  vehicelExpected,
  vehicle,
  vehicleLocation,
  vehicleLocationExpected
} from '../data/vehicle'
import { zodSchemaError } from '../data/zod'
import { Vehicle, VehicleLocation } from '.prisma/client'
const baseUrl = '/api/v1/vehicle'

export default (ctx: Context) => {
  describe('Vehicle', () => {
    describe('Vehicle register route', () => {
      checkUserAuthentication(ctx, 'api/v1/vehicle/register')
      describe('given vehicle data with some required fields missing', () => {
        it('should return 500', async () => {
          const data = await postApiCallWithAuthTest(
            ctx,
            baseUrl + '/register',
            clientUser2,
            {
              userId: clientUser2.id,
              gpsDeviceId: '123456',
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
          const data = await postApiCallWithAuthTest(
            ctx,
            baseUrl + '/register',
            clientUser,
            { ...vehicle[0], vehicleNumber: '1234' }
          )
          expect(data.statusCode).toBe(500)
        })
      })

      describe('given two vehicle with same vehicle number', () => {
        it('should return 400', async () => {
          const data = await postApiCallWithAuthTest(
            ctx,
            baseUrl + '/register',
            clientUser,
            vehicle[0]
          )
          expect(data.statusCode).toBe(400)
        })
      })
    })
  })

  describe('Vehicle Get Route', () => {
    checkUserAuthentication(ctx, 'api/v1/vehicle')
    describe('if user logged in and not admin', () => {
      it('should return 403', async () => {
        const data = await getApiCallWithAuthTest(ctx, baseUrl, clientUser2)
        expect(data.statusCode).toBe(403)
      })
    })

    describe('if user logged in and is admin', () => {
      it('should return array of registered vehicle', async () => {
        const data = await getApiCallWithAuthTest(ctx, baseUrl, adminUser)
        expect(data.statusCode).toBe(200)
        expect(data.body).toEqual({
          data: expect.any(Array<Vehicle>),
          pagination: {
            page: 0,
            perPage: 10,
            totalPage: 0
          }
        })
      })
    })
  })

  describe('Vehicle location update route', () => {
    checkUserAuthentication(ctx, 'api/v1/vehicle/location/update')
    describe('given vehicle data with some required fields missing', () => {
      it('should return 500', async () => {
        const data = await postApiCallWithAuthTest(
          ctx,
          baseUrl + '/location/update',
          clientUser2,
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
    describe('given vehicle location data', () => {
      it('should return vehicle location data', async () => {
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
  })
  describe("if user who doesn't own the vehicle try to update another vehicle", () => {
    it('should return 403', async () => {
      const data = await postApiCallWithAuthTest(
        ctx,
        baseUrl + '/location/update',
        clientUser3,
        vehicleLocation[0]
      )
      expect(data.statusCode).toBe(403)
    })
  })

  describe('Vehicle location get route', () => {
    checkUserAuthentication(ctx, `api/v1/vehicle/${vehicle[0].id}/location`)
    describe('if user logged in and not admin', () => {
      it('should return 403', async () => {
        const data = await getApiCallWithAuthTest(
          ctx,
          baseUrl +
            `/${vehicle[0].id}/location?from=${dayjs(vehicle[0].createdAt)
              .subtract(10, 'minute')
              .toISOString()}&to=${dayjs(vehicle[0].createdAt)
              .add(10, 'minutes')
              .toISOString()}`,
          clientUser2
        )
        expect(data.statusCode).toBe(403)
      })
    })
    describe('if vehicle id, from date and to date given', () => {
      it('should return vehicle location data array ', async () => {
        const data = await getApiCallWithAuthTest(
          ctx,
          baseUrl +
            `/${vehicle[0].id}/location?from=${dayjs(vehicle[0].createdAt)
              .subtract(10, 'minute')
              .toISOString()}&to=${dayjs(vehicle[0].createdAt)
              .add(10, 'minutes')
              .toISOString()}`,
          adminUser
        )
        expect(data.statusCode).toBe(200)
        expect(data.body).toEqual({
          data: expect.any(Array<VehicleLocation>),
          pagination: {
            page: expect.any(Number),
            perPage: expect.any(Number),
            totalPage: expect.any(Number)
          }
        })
      })
    })
  })
}
