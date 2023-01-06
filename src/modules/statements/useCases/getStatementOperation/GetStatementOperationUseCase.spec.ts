import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    })

    it("should be able to get statement operation", async () => {
        const user = await inMemoryUsersRepository.create({
            name: "User Test",
            email: "@mail.com",
            password: "1234"
        })

        const statement = await inMemoryStatementsRepository.create({
            amount: 100,
            description: "Statement Test",
            type: "deposit" as any,
            user_id: user.id as string
        })

        const result = await getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: statement.id as string
        })

        expect(result).toHaveProperty("id")
    })

    it("should not be able to get statement operation of a non existing user", () => {
        expect(async () => {
            await getStatementOperationUseCase.execute({
                user_id: "non existing user id",
                statement_id: "non existing statement id"
            })
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
    })

    it ("should not be able to get statement operation of a non existing statement", async () => {
        const user = await inMemoryUsersRepository.create({
            name: "User Test",
            email: "@mail.com",
            password: "1234"
        })

        expect(async () => {
            await getStatementOperationUseCase.execute({
                user_id: user.id as string,
                statement_id: "non existing statement id"
            })
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
    })
})