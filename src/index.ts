import config from './config'
import logger from './logger'
import server from './server'
import { createPrismaContext } from './db'
const prismaContext = createPrismaContext()
const { port, host } = config
const app = server(prismaContext)
app.listen(port, host, () => {
  logger.warn('Server running on ' + host + ':' + port)
})
