import { randomUUID } from "node:crypto";

import { User } from "../generated/prisma/client";
import { UsersRepository } from "../users-repository";
import { UserCreateInput } from "../generated/prisma/models";

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = [];

  async create({ name, email, password }: UserCreateInput) {
    const user = {
      id: randomUUID(),
      name,
      email,
      password,
      createdAt: new Date(),
    };

    this.users.push(user);

    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find((us) => us.email === email);

    return user ?? null;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = this.users.find((item) => item.id === id);

    return user ?? null;
  }
}
