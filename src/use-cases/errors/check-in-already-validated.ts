export class CheckInAlreadyValidated extends Error {
  constructor() {
    super("Check-in already validated");
  }
}
