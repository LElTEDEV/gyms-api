import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";

import { InvalidCredentialsError } from "../../../use-cases/errors/invalid-credentials-error";
import { makeAuthenticateUseCaseFactory } from "../../../factories/make-authenticate-use-case-factory";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    email: z.email(),
    password: z.string(),
  });

  const { email, password } = bodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCaseFactory();
    const { user } = await authenticateUseCase.execute({ email, password });

    // Geração do meu JWT
    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    );

    // Geração do meu refreshToken
    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
          expiresIn: "7d",
        },
      },
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}
