import { FastifyReply, FastifyRequest } from "fastify";
import { makeGetUserForRefreshTokenUseCase } from "../../../factories/make-get-user-for-refresh-token-factory";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify({
      onlyCookie: true,
    });

    const getUserForRefreshUseCase = makeGetUserForRefreshTokenUseCase();
    const { user } = await getUserForRefreshUseCase.execute({
      userId: request.user.sub,
    });

    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: request.user.sub,
        },
      },
    );

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: request.user.sub,
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
      .send(200)
      .send({ token });
  } catch (error) {
    throw error;
  }
}
