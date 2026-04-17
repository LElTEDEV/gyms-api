import { FastifyReply, FastifyRequest } from "fastify";
import { makeGetUserMetricsUseCaseFactory } from "../../../factories/make-get-user-metrics-use-case-factory";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getUserMetricsUseCase = makeGetUserMetricsUseCaseFactory();
    const { numberOfCheckIns } = await getUserMetricsUseCase.execute({
      userId: request.user.sub,
    });

    return reply.status(200).send({ checkIns: numberOfCheckIns });
  } catch (error) {
    throw error;
  }
}
