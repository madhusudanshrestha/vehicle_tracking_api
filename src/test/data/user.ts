import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

export const invalidClientUser = {
  id: uuidv4(),
  firstName: 'John',
  lastName: 'Doe',
  password: 'password',
  createdAt: dayjs().toDate(),
  updatedAt: dayjs().toDate(),
  email: 'johndoe@example.com',
  isAdmin: false,
  profilePicture: ''
}
export const clientUser = {
  id: uuidv4(),
  firstName: 'John',
  lastName: 'Doe',
  password: 'password',
  createdAt: dayjs().toDate(),
  updatedAt: dayjs().toDate(),
  email: 'johndoe@example.com',
  isAdmin: false,
  profilePicture: ''
}

export const clientUserExpected = {
  id: clientUser.id,
  firstName: 'John',
  lastName: 'Doe',
  createdAt: clientUser.createdAt.toISOString(),
  updatedAt: clientUser.updatedAt.toISOString(),
  email: 'johndoe@example.com',
  isAdmin: false,
  profilePicture: ''
}

export const clientUser2 = {
  id: uuidv4(),
  firstName: 'John',
  lastName: 'Doe',
  password: 'password',
  createdAt: dayjs().toDate(),
  updatedAt: dayjs().toDate(),
  email: 'johndoe2@example.com',
  isAdmin: false,
  profilePicture: ''
}
export const clientUser3 = {
  id: uuidv4(),
  firstName: 'John',
  lastName: 'Doe',
  password: 'password',
  createdAt: dayjs().toDate(),
  updatedAt: dayjs().toDate(),
  email: 'johndoe3@example.com',
  isAdmin: false,
  profilePicture: ''
}

export const adminUser = {
  id: uuidv4(),
  firstName: 'James',
  lastName: 'Doe',
  password: 'password',
  createdAt: dayjs().toDate(),
  updatedAt: dayjs().toDate(),
  email: 'jamesdoe@example.com',
  isAdmin: true,
  profilePicture: ''
}
