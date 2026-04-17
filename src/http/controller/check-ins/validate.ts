import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";

import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";
import { CheckInAlreadyValidated } from "../../../use-cases/errors/check-in-already-validated";
import { LateCheckInValidationError } from "../../../use-cases/errors/late-check-in-validation-error";
import { makeValidateCheckInUseCaseFactory } from "../../../factories/make-validate-check-in-use-case-factory";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.uuid(),
  });

  const { checkInId } = validateCheckInParamsSchema.parse(request.params);

  try {
    const validateCheckInUseCase = makeValidateCheckInUseCaseFactory();
    await validateCheckInUseCase.execute({ checkInId });

    return reply.status(204).send();
  } catch (error) {
    if (
      error instanceof ResourceNotFoundError ||
      error instanceof LateCheckInValidationError ||
      error instanceof CheckInAlreadyValidated
    ) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}
