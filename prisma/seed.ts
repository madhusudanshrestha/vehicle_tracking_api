import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/service/auth'
import dotenv from 'dotenv'
dotenv.config()
const prisma = new PrismaClient()
//Seed admin user
async function main() {
  const password =
    process.env.ADMIN_PASSWORD || Math.random().toString(36).slice(-8)
  const email = process.env.ADMIN_EMAIL || 'admin@example.com'
  const admin = await prisma.user.upsert({
    where: { email: email },
    update: {},
    create: {
      email: email,
      firstName: 'Admin',
      lastName: 'User',
      password: await hashPassword(password),
      isAdmin: true
    }
  })
  console.log('User', { admin })
  console.log('_______________________________________')
  console.log('Your email: ', admin.email)
  console.log('Your password: ', password)
  console.log('_______________________________________')
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
