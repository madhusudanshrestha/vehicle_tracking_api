import { User } from '@prisma/client'
import { generateToken } from '../service/auth'
import supertest from 'supertest'
import server from '../server'
import { Context } from '../db'
export const checkUserAuthentication = (ctx: Context, url: string) => {
  return describe('if user is not logged in', () => {
    it('should return 403', async () => {
      const data = await supertest(server(ctx)).get(url)
      expect(data.statusCode).toBe(403)
    })
  })
}

export const postApiCallTest = async (
  ctx: Context,
  uri: string,
  params: object
) => {
  return await supertest(server(ctx)).post(uri).send(params)
}

export const postApiCallWithAuthTest = async (
  ctx: Context,
  uri: string,
  user: User,
  params: object
) => {
  const jwt = generateToken(user.id) //Generate jwt
  return await supertest(server(ctx))
    .post(uri)
    .set('Authorization', `Bearer ${jwt}`)
    .send(params)
}

export const getApiCallWithAuthTest = async (
  ctx: Context,
  uri: string,
  user: User
) => {
  const jwt = generateToken(user.id)
  return await supertest(server(ctx))
    .get(uri)
    .set('Authorization', `Bearer ${jwt}`)
}

export const getApiCallTest = async (ctx: Context, uri: string) => {
  return await supertest(server(ctx)).get(uri)
}
