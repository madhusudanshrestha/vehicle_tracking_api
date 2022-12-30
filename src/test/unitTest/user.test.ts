import { Context, MockContext, createMockContext } from '../../db'
import { clientUser, invalidClientUser, clientUserExpected } from '../data/user'
import {
  getApiCallTest,
  getApiCallWithAuthTest,
  postApiCallTest
} from '../index.test'
let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = mockCtx as unknown as Context
})

const baseUrl = '/api/v1/user'
describe('User', () => {
  describe('Create user', () => {
    it('should create a new user', async () => {
      const { firstName, lastName, email, password } = clientUser
      mockCtx.prisma.user.create.mockResolvedValue(clientUser)
      mockCtx.prisma.user.findFirst.mockResolvedValue(null)
      const data = await postApiCallTest(ctx, baseUrl + '/create', {
        firstName,
        lastName,
        email,
        password
      })
      expect(data.statusCode).toBe(201)
      expect(data.body).toEqual({ data: clientUserExpected })
    })
  })
  describe('Get user info', () => {
    describe('if token invalid', () => {
      it('should return 403', async () => {
        const data = await getApiCallTest(ctx, baseUrl + '/me')
        expect(data.statusCode).toBe(403)
      })
    })
    describe('if token valid', () => {
      it('should return user object', async () => {
        mockCtx.prisma.user.findFirst.mockResolvedValue(clientUser)
        mockCtx.prisma.user.findUnique.mockResolvedValue(clientUser)
        const data = await getApiCallWithAuthTest(
          ctx,
          baseUrl + '/me',
          clientUser
        )
        expect(data.statusCode).toBe(200)
        expect(data.body).toEqual({ data: clientUserExpected })
      })
    })
    describe('if user invalid', () => {
      it('should return 403', async () => {
        mockCtx.prisma.user.findFirst.mockResolvedValue(null)
        mockCtx.prisma.user.findUnique.mockResolvedValue(null)
        const data = await getApiCallWithAuthTest(
          ctx,
          baseUrl + '/me',
          invalidClientUser
        )
        expect(data.statusCode).toBe(403)
      })
    })
  })
})
