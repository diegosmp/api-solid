import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Dumbblless D1',
        description: 'Foco, força e fé',
        phone: '123456',
        latitude: -3.7217916,
        longitude: -38.5926336,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Dumbblless D2',
        description: 'Foco, força e fé',
        phone: '123456',
        latitude: -3.7424962,
        longitude: -38.4721971,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -3.7424962,
        longitude: -38.4721971,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'Dumbblless D2' }),
    ])
  })
})
