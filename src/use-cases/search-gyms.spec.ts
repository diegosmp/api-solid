import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('Should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Dumbblless D1',
      description: 'Foco, força e fé',
      phone: '123456',
      latitude: -3.7217916,
      longitude: -38.5926336,
    })

    await gymsRepository.create({
      title: 'Dumbblless D2',
      description: 'Foco, força e fé',
      phone: '123456',
      latitude: -3.7217916,
      longitude: -38.5926336,
    })

    const { gyms } = await sut.execute({
      query: 'Dumbblless D1',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Dumbblless D1' })])
  })

  it('Should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Dumbblless D${i}`,
        description: 'Foco, força e fé',
        phone: '123456',
        latitude: -3.7217916,
        longitude: -38.5926336,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Dumbblless',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Dumbblless D21' }),
      expect.objectContaining({ title: 'Dumbblless D22' }),
    ])
  })
})
