import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";

import { MaxDistanceError } from "../../../use-cases/errors/max-distance-error";
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";
import { makeCheckInUseCaseFactory } from "../../../factories/make-check-in-use-case-factory";
import { MaxNumberOfCheckInsError } from "../../../use-cases/errors/max-number-of-check-ins-error";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    gymId: z.uuid(),
  });

  const bodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { gymId } = paramsSchema.parse(request.params);
  const { latitude, longitude } = bodySchema.parse(request.body);

  try {
    const createCheckInUseCase = makeCheckInUseCaseFactory();
    const { checkIn } = await createCheckInUseCase.execute({
      userId: request.user.sub,
      gymId,
      userLatitude: latitude,
      userLongitude: longitude,
    });

    return reply.status(201).send({ checkIn });
  } catch (error) {
    if (
      error instanceof ResourceNotFoundError ||
      error instanceof MaxNumberOfCheckInsError ||
      error instanceof MaxDistanceError
    ) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}
