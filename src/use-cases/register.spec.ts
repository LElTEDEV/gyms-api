import { verify } from "argon2";
import { beforeEach, describe, expect, it } from "vitest";

import { RegisterUseCase } from "./register";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { InMemoryUsersRepository } from "../repository/in-memory/in-memory-users-repository";

describe("Register Use Case", () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: RegisterUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123123",
    });

    const isPasswordCorrectlyHashed = await verify(user.password, "123123");

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register a user with same email", async () => {
    await sut.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123123",
    });

    await expect(
      sut.execute({
        name: "John Doe",
        email: "johndoe@gmail.com",
        password: "123123",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
