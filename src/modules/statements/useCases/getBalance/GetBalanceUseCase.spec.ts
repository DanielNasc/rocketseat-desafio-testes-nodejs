import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
    })

    it("should be able to get balance", async () => {
        const user = await inMemoryUsersRepository.create({
            name: "User Test",
            email: "@mail.com",
            password: "1234"
        })

        const result = await getBalanceUseCase.execute({
            user_id: user.id as string
        })

        expect(result).toHaveProperty("balance")
    })

    it("should not be able to get balance of a non existing user", () => {
        expect(async () => {
            await getBalanceUseCase.execute({
                user_id: "non existing user id"
            })
        }).rejects.toBeInstanceOf(GetBalanceError)
    })
})