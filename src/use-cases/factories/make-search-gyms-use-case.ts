import { PrismaGymsRepository } from '@/repositories/Prisma/prisma-gyms-repository'
import { SearchGymsUseCase } from '../search-gyms'

export async function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new SearchGymsUseCase(gymsRepository)
  return useCase
}
