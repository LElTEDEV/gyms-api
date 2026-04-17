import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";

import { makeFetchUserCheckInHistoryUseCaseFactory } from "../../../factories/make-fetch-user-check-in-history-use-case-factory";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(request.query);

  try {
    const fetchUserCheckInUseCase = makeFetchUserCheckInHistoryUseCaseFactory();
    const { checkIns } = await fetchUserCheckInUseCase.execute({
      page,
      userId: request.user.sub,
    });

    return reply.status(200).send({ checkIns });
  } catch (error) {
    throw error;
  }
}
