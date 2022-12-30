import dotenv from 'dotenv'
dotenv.config()
export default {
  port: parseInt(process.env.PORT || '3000'),
  host: process.env.HOST || 'localhost',
  databaseUrl: process.env.DATABASE_URL || '',
  JWTtoken: {
    secret: process.env.JWT_TOKEN_SECRET || 'devSecret',
    expiryTime: process.env.JWT_TOKEN_EXPIRY_TIME || 3600
  }
}
