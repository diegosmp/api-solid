import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('Should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Dumbblless D1 Near',
      description: 'Foco, força e fé',
      phone: '123456',
      latitude: -3.7217916,
      longitude: -38.5926336,
    })

    await gymsRepository.create({
      title: 'Dumbblless D2 Far',
      description: 'Foco, força e fé',
      phone: '123456',
      latitude: -3.7424962,
      longitude: -38.4721971,
    })

    const { gyms } = await sut.execute({
      userLatitude: -3.7217916,
      userLongitude: -38.5926336,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Dumbblless D1 Near' }),
    ])
  })
})
