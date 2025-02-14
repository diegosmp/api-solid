import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Dumbbells D1',
        description: 'Just description',
        phone: '85999999999',
        latitude: -3.7217916,
        longitude: -38.5926336,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Dumbbells D2',
        description: 'Just description',
        phone: '85999999999',
        latitude: -3.7217916,
        longitude: -38.5926336,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'Dumbbells D2',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'Dumbbells D2' }),
    ])
  })
})
