import { Context } from '../db'
import userAuthRoute from './auth/user.auth.route'
import vehicleAuthRoute from './auth/vehicle.auth.routes'
import userGuestRoute from './guest/user.guest.route'
import express, { Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../../swagger.json'

const apiVersion = '/api/v1/'

const routes = (app: express.Application, ctx: Context) => {
  //DOC
  app.use('/api-docs', swaggerUi.serve)
  app.get('/api-docs', swaggerUi.setup(swaggerDocument))
  app.get('/ping', (req: Request, res: Response) => {
    res.send('pong')
  })

  app.use(`${apiVersion}user`, userGuestRoute(ctx), userAuthRoute(ctx))
  app.use(`${apiVersion}vehicle`, vehicleAuthRoute(ctx))
}

export default routes
