import { PrismaUsersRepository } from "@/repositories/Prisma/prisma-users-repository"
import { RegisterUseCase } from "../register"

export async function makeRegisterUseCase () {
    const usersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)
    return registerUseCase
}