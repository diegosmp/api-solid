import fastify from 'fastify'
import { register } from './http/controllers/register'

const app = fastify()

app.post('/users', register)

export default app
