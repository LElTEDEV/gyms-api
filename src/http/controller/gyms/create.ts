import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateGymUseCaseFactory } from "../../../factories/make-create-gym-use-case-factory";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    title: z
      .string()
      .min(3, "O nome precisa ter pelo menos 3 caracteres")
      .max(120, "O nome precisa de no máximo 120 caracteres"),
    description: z
      .string()
      .max(120, "A descrição precisa de no máximo 120 caracteres")
      .nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { title, description, phone, latitude, longitude } = bodySchema.parse(
    request.body,
  );

  try {
    const createGymUseCase = makeCreateGymUseCaseFactory();
    await createGymUseCase.execute({
      title,
      description,
      phone,
      latitude,
      longitude,
    });

    return reply.status(201).send();
  } catch (error) {
    throw error;
  }
}
