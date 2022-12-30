import express from 'express'
import routes from './routes/routes'
import { errorHandler } from './middleware/errorHandler.middleware'
import { Context } from './db'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

export default (ctx: Context) => {
  const corsOption = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  }
  const limiter = rateLimit({
    windowMs: 1000, // 15 minutes
    max: 11, // Limit each IP to 11 requests per `window` (here, per 1 second)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false // Disable the `X-RateLimit-*` headers
  })
  const app = express()
  app.use(cors(corsOption))
  app.use(limiter)
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  routes(app, ctx)

  app.use(errorHandler)
  return app
}
