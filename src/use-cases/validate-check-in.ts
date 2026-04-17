import dayjs from "dayjs";

import { CheckIn } from "../generated/prisma/client";
import { CheckInsRepository } from "../repository/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { CheckInAlreadyValidated } from "./errors/check-in-already-validated";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

interface ValidateCheckInRequest {
  checkInId: string;
}

interface ValidateCheckInResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInRequest): Promise<ValidateCheckInResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) throw new ResourceNotFoundError();

    const checkInAlreadyValidated = checkIn.validatedAt !== null;

    if (checkInAlreadyValidated) throw new CheckInAlreadyValidated();

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.createdAt,
      "minutes",
    );

    if (distanceInMinutesFromCheckInCreation > 20)
      throw new LateCheckInValidationError();

    checkIn.validatedAt = new Date();

    await this.checkInsRepository.save(checkIn);

    return { checkIn };
  }
}
