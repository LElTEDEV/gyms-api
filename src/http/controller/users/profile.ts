import { FastifyReply, FastifyRequest } from "fastify";

import { makeGetUserProfileUseCaseFactory } from "../../../factories/make-get-user-profile-use-case-factory";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCaseFactory();

  const { user } = await getUserProfile.execute({ userId: request.user.sub });

  const { password, ...restUser } = user;

  return reply.status(200).send({
    user: restUser,
  });
}
