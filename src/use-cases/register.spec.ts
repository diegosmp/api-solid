import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { PrismaUsersRepository } from '@/repositories/Prisma/prisma-users-repository'
import { compare } from 'bcryptjs'

describe('Register Use Case', () => {
    it('Should hash user password upon registration', async () => {
        const prismaUsersRepository = new PrismaUsersRepository()
        const registerUseCase = new RegisterUseCase(prismaUsersRepository)

        const { user } = await registerUseCase.execute({
            name: 'Jonh Doe',
            email: 'jonhdoe@email.com',
            password: '123456'
        })

        const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)

        expect(isPasswordCorrectlyHashed).toBe(true)
    })
})