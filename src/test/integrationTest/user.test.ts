import { Context } from '../../db'
import { clientUser, invalidClientUser } from '../data/user'
import { getApiCallWithAuthTest, postApiCallTest } from '../index.test'
const baseUrl = '/api/v1/user'
export default (ctx: Context) => {
  describe('User', () => {
    describe('Create user', () => {
      it('should create a new user', async () => {
        const data = await postApiCallTest(ctx, baseUrl + '/create', clientUser)
        expect(data.statusCode).toBe(201)
        expect(data.body).toEqual({
          data: {
            id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            profilePicture: '',
            firstName: clientUser.firstName,
            email: clientUser.email,
            lastName: clientUser.lastName,
            isAdmin: false
          }
        })
      })
    })
    describe('Get user info', () => {
      describe('if token invalid', () => {
        it('should return 403', async () => {
          const data = await getApiCallWithAuthTest(
            ctx,
            baseUrl + '/me',
            invalidClientUser
          )
          expect(data.statusCode).toBe(403)
        })
      })
      describe('if token valid', () => {
        it('should return user object', async () => {
          const data = await getApiCallWithAuthTest(
            ctx,
            baseUrl + '/me',
            clientUser
          )
          expect(data.statusCode).toBe(200)
          expect(data.body).toEqual({
            data: {
              id: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              profilePicture: '',
              firstName: clientUser.firstName,
              email: clientUser.email,
              lastName: clientUser.lastName,
              isAdmin: false
            }
          })
        })
      })
    })
  })
}
