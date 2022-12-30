import { User } from '@prisma/client'
import { Context } from '../db'
import { HttpException } from '../exception/http.exception'
import { hashPassword } from '../service/auth'
import dayjs from 'dayjs'

/**
 * Find all users in the database
 * @returns User[] promise
 */
export const findAllUser = async (ctx: Context): Promise<User[]> => {
  const allUser: User[] = await ctx.prisma.user.findMany()
  return allUser
}

/**
 * Get user by id
 * @param userId the user id
 * @returns
 */
export const findUserById = async (
  ctx: Context,
  userId: string
): Promise<User> => {
  const findUser: User | null = await ctx.prisma.user.findUnique({
    where: { id: userId }
  })
  if (!findUser) throw new HttpException(403, "User doesn't exist")
  return findUser
}
/**
 * Get user by email
 * @param email
 * @returns
 */
export const findUserByEmail = async (
  ctx: Context,
  email: string
): Promise<User> => {
  const findUser: User | null = await ctx.prisma.user.findFirst({
    where: { email: email }
  })
  if (!findUser) throw new HttpException(403, "User doesn't exist")

  return findUser
}
/**
 * Create new user
 * @param userData the user model object
 * @returns
 */
export const userCreate = async (
  ctx: Context,
  userData: User
): Promise<User> => {
  const { password } = userData
  return await ctx.prisma.user.create({
    data: {
      ...userData,
      createdAt: dayjs().toDate(),
      password: await hashPassword(password)
    }
  })
}
/**
 * Update new user
 * @param userId the id of the user
 * @param userData the user model object
 * @returns
 */
export const userUpdate = async (
  ctx: Context,
  userId: string,
  userData: User
): Promise<User> => {
  const { firstName, lastName, profilePicture } = userData
  return await ctx.prisma.user.update({
    where: { id: userId },
    data: {
      firstName: firstName,
      lastName: lastName,
      profilePicture: profilePicture
    }
  })
}
/**
 * Delete new user
 * @param userId the id of the user
 * @returns
 */
export const userDelete = async (
  ctx: Context,
  userId: string
): Promise<User> => {
  return await ctx.prisma.user.delete({ where: { id: userId } })
}
