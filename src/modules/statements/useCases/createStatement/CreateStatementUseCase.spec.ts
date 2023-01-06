import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Create Statement", () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })

    it("should be able to create a new statement", async () => {
        const { id: user_id } = await createUserUseCase.execute({
            name: "User Test",
            email: "user@email.com",
            password: "1234"
        })

        const statement = await createStatementUseCase.execute({
            user_id: user_id as string,
            type: "deposit" as any,
            amount: 100,
            description: "Statement Test"
        })

        expect(statement).toHaveProperty("id")
    })

    it("should not be able to create a new statement with a non existing user", () => {
        expect(async () => {
            await createStatementUseCase.execute({
                user_id: "non existing user id",
                type: "deposit" as any,
                amount: 100,
                description: "Statement Test"
            })
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
    })

    it("should not be able to create a new statement with insufficient funds", () => {
        expect(async () => {
            const { id: user_id } = await createUserUseCase.execute({
                name: "User Test",
                email: "user@email.com",
                password: "1234"
            })

            await createStatementUseCase.execute({
                user_id: user_id as string,
                type: "withdraw" as any,
                amount: 1000000,
                description: "Statement Test"
            })
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
    })
})