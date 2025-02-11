import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('Should be able to create gym', async () => {
    // -3.7217916,-38.5926336  Dumbbells
    const { gym } = await sut.execute({
      title: 'Dumbbells',
      description: 'Foco, força e fé',
      phone: '123456',
      latitude: -3.7217916,
      longitude: -38.5926336,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
