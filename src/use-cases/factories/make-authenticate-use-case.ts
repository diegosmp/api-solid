import { PrismaUsersRepository } from '@/repositories/Prisma/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAutheticateUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const authenticarUseCase = new AuthenticateUseCase(usersRepository)
  return authenticarUseCase
}
