import { domain } from "@palmares/core";
import { serverDomainModifier } from "@palmares/server";
import { testDomainModifier } from "@palmares/tests";

import { route } from "./routes";
import { databaseDomainModifier } from "@palmares/databases";
import * as models from "./models";

export default domain("orders", import.meta.dirname, {
  modifiers: [databaseDomainModifier, serverDomainModifier] as const,
  getRoutes: async () => route,
  getModels: async () => [models.Order],
  getMigrations: async () => [],
});
