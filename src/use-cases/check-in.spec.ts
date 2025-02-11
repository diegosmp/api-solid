import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckinUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckinUseCase

describe('Check-In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckinUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gymId-01',
      title: 'Dumbbells',
      description: 'Foco, força e fé',
      phone: '123456',
      latitude: -3.7217916,
      longitude: -38.5926336,
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
      userLatitude: -3.7217916,
      userLongitude: -38.5926336,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 1, 10, 8, 0, 0))

    await sut.execute({
      gymId: 'gymId-01',
      userId: 'userId-01',
      userLatitude: -3.7217916,
      userLongitude: -38.5926336,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gymId-01',
        userId: 'userId-01',
        userLatitude: -3.7217916,
        userLongitude: -38.5926336,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('Should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2025, 1, 10, 8, 0, 0))

    await sut.execute({
      gymId: 'gymId-01',
      userId: 'userId-01',
      userLatitude: -3.7217916,
      userLongitude: -38.5926336,
    })

    vi.setSystemTime(new Date(2025, 1, 11, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gymId-01',
      userId: 'userId-01',
      userLatitude: -3.7217916,
      userLongitude: -38.5926336,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in on distant gym', async () => {
    // -3.7217916,-38.5926336  Dumbbells
    gymsRepository.items.push({
      id: 'gymId-02',
      title: 'Dumbbless D2',
      description: '',
      latitude: new Decimal(-3.7217916),
      longitude: new Decimal(-38.5926336),
      phone: '',
    })

    await expect(() =>
      sut.execute({
        gymId: 'gymId-02',
        userId: 'userId-01',
        userLatitude: -3.716671,
        userLongitude: -38.600207,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
