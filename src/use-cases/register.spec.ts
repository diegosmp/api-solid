import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

// const usersRepository = new InMemoryUsersRepository()
// const sut = new RegisterUseCase(usersRepository)

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new RegisterUseCase(usersRepository)
    })

    it('Should be able to register', async () => {

        const { user } = await sut.execute({
            name: 'Jonh Doe',
            email: 'jonhdoe@email.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('Should hash user password upon registration', async () => {

        const { user } = await sut.execute({
            name: 'Jonh Doe',
            email: 'jonhdoe@email.com',
            password: '123456'
        })

        const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)

        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('Should not be able to register with same email twice', async () => {

        const email = 'jhondoe@example.com'

        await sut.execute({
            name: 'Jonh Doe',
            email,
            password: '123456'
        })

        expect( async () => (
            await sut.execute({
                name: 'Jonh Doe',
                email,
                password: '123456'
                })
            )
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})