import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeSearchGymsUseCaseFactory } from "../../../factories/make-search-gyms-use-case-factory";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { q, page } = searchGymsQuerySchema.parse(request.query);

  try {
    const searchGymsUseCase = makeSearchGymsUseCaseFactory();
    const { gyms } = await searchGymsUseCase.execute({ query: q, page });

    return reply.status(200).send({ gyms });
  } catch (error) {
    throw error;
  }
}
