import { verify } from "argon2";

import { User } from "../generated/prisma/client";
import { UsersRepository } from "../repository/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  user: User;
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) throw new InvalidCredentialsError();

    const doesPasswordMatches = await verify(user.password, password);

    if (!doesPasswordMatches) throw new InvalidCredentialsError();

    return { user };
  }
}
