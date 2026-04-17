import { hash } from "argon2";

import { User } from "../generated/prisma/client";
import { UsersRepository } from "../repository/users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.userRepository.findUserByEmail(email);

    if (userWithSameEmail) throw new UserAlreadyExistsError();

    const passwordHash = await hash(password);

    const user = await this.userRepository.create({
      name,
      email,
      password: passwordHash,
    });

    return { user };
  }
}
