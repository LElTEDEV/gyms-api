import { FastifyInstance } from "fastify";

import { verifyJWT } from "../../middlewares/verify-jwt";

import { create } from "./create";
import { metrics } from "./metrics";
import { history } from "./history";
import { validate } from "./validate";

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/check-in/metrics", metrics);
  app.get("/check-in/history", history);

  app.post("/gyms/:gymId/check-ins", create);
  app.patch("/check-in/:checkInId/validate", validate);
}
