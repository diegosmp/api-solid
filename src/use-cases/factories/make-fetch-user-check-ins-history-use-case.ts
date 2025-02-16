import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history'
import { PrismaCheckInsRepository } from '@/repositories/Prisma/prisma-check-ins-repository'

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  return useCase
}
