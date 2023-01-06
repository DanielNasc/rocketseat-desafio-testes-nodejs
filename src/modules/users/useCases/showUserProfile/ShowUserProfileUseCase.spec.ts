import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    })

    it("should be able to show user profile", async () => {
        const user = await createUserUseCase.execute({
            name: "User Test",
            email: "user@email.com",
            password: "1234"
        })

        const result = await showUserProfileUseCase.execute(user.id as string);

        expect(result).toHaveProperty("id")
    })

    it("should not be able to show user profile of a non existing user", () => {
        expect(async () => {
            await showUserProfileUseCase.execute("non existing user id")
        }).rejects.toBeInstanceOf(ShowUserProfileError)
    })
})