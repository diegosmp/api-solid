import { PrismaGymsRepository } from '@/repositories/Prisma/prisma-gyms-repository'
import { CheckinUseCase } from '../check-in'
import { PrismaCheckInsRepository } from '@/repositories/Prisma/prisma-check-ins-repository'

export async function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CheckinUseCase(checkInsRepository, gymsRepository)
  return useCase
}
