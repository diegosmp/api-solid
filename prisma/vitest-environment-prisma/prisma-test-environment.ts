import 'dotenv/config'
import { execSync } from 'node:child_process'

import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest'

// postgresql://docker:docker@localhost:5432/mydb?apisolid=public

function generateDatabeURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL envirionment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  async setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabeURL(schema)

    process.env.DATABASE_URL = databaseURL

    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        console.log('Teardown')
      },
    }
  },
}
