import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeFetchNearbyGymsUseCaseFactory } from "../../../factories/make-fetch-nearby-gyms-use-case-factory";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyBodySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),

    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = nearbyBodySchema.parse(request.query);

  try {
    const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCaseFactory();
    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: latitude,
      userLongitude: longitude,
    });

    return reply.status(200).send({ gyms });
  } catch (error) {
    throw error;
  }
}
