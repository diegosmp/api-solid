import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckinUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckinUseCase

describe('Check-In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckinUseCase(checkInsRepository)
  })

  it('Should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gymId-01',
      userId: 'userId-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
