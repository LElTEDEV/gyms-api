import { FastifyInstance } from "fastify";

import { refresh } from "./refresh";
import { profile } from "./profile";
import { register } from "./register";
import { authenticate } from "./authenticate";

import { verifyJWT } from "../../middlewares/verify-jwt";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  app.patch("/token/refresh", refresh);

  // ROTAS PRIVADAS -> USUÁRIO AUTENTICADO
  app.get(
    "/me",
    {
      onRequest: [verifyJWT],
    },
    profile,
  );
}
