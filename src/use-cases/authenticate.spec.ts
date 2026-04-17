import { hash } from "argon2";
import { beforeEach, describe, expect, it } from "vitest";

import { AuthenticateUseCase } from "./authenticate";
import { UsersRepository } from "../repository/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { InMemoryUsersRepository } from "../repository/in-memory/in-memory-users-repository";

describe("Authenticate Use Case", () => {
  let usersRepository: UsersRepository;
  let sut: AuthenticateUseCase;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: await hash("123123"),
    });
  });

  it("should be able to authenticate", async () => {
    const { user } = await sut.execute({
      email: "johndoe@gmail.com",
      password: "123123",
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("John Doe");
  });

  it("should not be able to authenticate with invalid credentials", async () => {
    await expect(
      sut.execute({
        email: "johndoe@gmail.com",
        password: "123123123",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);

    await expect(
      sut.execute({
        email: "igor@igor.com",
        password: "123123",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
