import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckinUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckinUseCase

describe('Check-In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckinUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should be able to check in', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gymId-01',
      userId: 'userId-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 1, 10, 8, 0, 0))

    await sut.execute({
      gymId: 'gymId-01',
      userId: 'userId-01',
    })

    await expect(() =>
      sut.execute({
        gymId: 'gymId-01',
        userId: 'userId-01',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
