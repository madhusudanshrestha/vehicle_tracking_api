import dayjs from 'dayjs'
import pino from 'pino'
export default pino({
  prettifier: true,
  timestamp: () => `, "time":"${dayjs().format()}`
})
