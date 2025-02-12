import { PrismaCheckInsRepository } from '@/repositories/Prisma/prisma-check-ins-repository'
import { ValidateCheckInsUseCase } from '../validate-check-ins'

export async function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new ValidateCheckInsUseCase(checkInsRepository)
  return useCase
}
