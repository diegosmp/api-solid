import { PrismaUsersRepository } from '@/repositories/Prisma/prisma-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile'

export async function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetUserProfileUseCase(usersRepository)
  return useCase
}
