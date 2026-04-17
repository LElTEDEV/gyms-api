import { User } from "../generated/prisma/client";
import { UserCreateInput } from "../generated/prisma/models";

export interface UsersRepository {
  findUserById: (id: string) => Promise<User | null>;
  findUserByEmail: (email: string) => Promise<User | null>;
  create: ({ name, email, password }: UserCreateInput) => Promise<User>;
}
