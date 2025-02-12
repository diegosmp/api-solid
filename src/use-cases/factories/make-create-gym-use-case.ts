import { PrismaGymsRepository } from '@/repositories/Prisma/prisma-gyms-repository'
import { CreateGymUseCase } from '../create-gym'

export async function makeCreateGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CreateGymUseCase(gymsRepository)
  return useCase
}
