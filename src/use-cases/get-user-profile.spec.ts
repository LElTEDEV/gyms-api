import { beforeEach, describe, expect, it } from "vitest";

import { GetUserProfileUseCase } from "./get-user-profile";
import { UsersRepository } from "../repository/users-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { InMemoryUsersRepository } from "../repository/in-memory/in-memory-users-repository";

describe("Get User Profile Use Case", () => {
  let usersRepository: UsersRepository;
  let sut: GetUserProfileUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to find a user by your userId", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123123",
    });

    const { user } = await sut.execute({ userId: createdUser.id });

    expect(user.name).toEqual("John Doe");
    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to find a user with wrong userId", async () => {
    await expect(
      sut.execute({ userId: "298i9592k2924" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
