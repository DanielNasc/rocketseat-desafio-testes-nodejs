import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })

    it("should be able to authenticate an user", async () => {
        const user: ICreateUserDTO = {
            email: "user@email.com",
            name: "User Test",
            password: "1234"
        }

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        })

        expect(result).toHaveProperty("token")
    })

    it("should not be able to authenticate a non existing user", () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "whuefhqhvefklwbfm",
                password: "1234"
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })

    it("should not be able to authenticate with incorrect password", async () => {
        const user: ICreateUserDTO = {
            email: "user@email.com",
            name: "User",
            password: "1234"
        }

        await createUserUseCase.execute(user);

        expect(async () => {
            await authenticateUserUseCase.execute({
                email: user.email,
                password: "incorrect password"
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })
})