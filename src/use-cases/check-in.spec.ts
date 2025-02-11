import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckinUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckinUseCase

describe('Check-In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckinUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.items.push({
      id: 'gymId-01',
      title: 'Dumbbless',
      description: '',
      latitude: new Decimal(-3.716671),
      longitude: new Decimal(-38.600207),
      phone: '',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gymId-01',
      userId: 'userId-01',
      userLatitude: -3.716671,
      userLongitude: -38.600207,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 1, 10, 8, 0, 0))

    await sut.execute({
      gymId: 'gymId-01',
      userId: 'userId-01',
      userLatitude: -3.716671,
      userLongitude: -38.600207,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gymId-01',
        userId: 'userId-01',
        userLatitude: -3.716671,
        userLongitude: -38.600207,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('Should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2025, 1, 10, 8, 0, 0))

    await sut.execute({
      gymId: 'gymId-01',
      userId: 'userId-01',
      userLatitude: -3.716671,
      userLongitude: -38.600207,
    })

    vi.setSystemTime(new Date(2025, 1, 11, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gymId-01',
      userId: 'userId-01',
      userLatitude: -3.716671,
      userLongitude: -38.600207,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in on distant gym', async () => {
    // -3.722393, -38.590762
    gymsRepository.items.push({
      id: 'gymId-02',
      title: 'Dumbbless D2',
      description: '',
      latitude: new Decimal(-3.722393),
      longitude: new Decimal(-38.590762),
      phone: '',
    })

    await expect(() => {
      sut.execute({
        gymId: 'gymId-02',
        userId: 'userId-01',
        userLatitude: -3.716671,
        userLongitude: -38.600207,
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
