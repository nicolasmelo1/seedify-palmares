import { ConsoleLogging } from "@palmares/console-logging";
import { CoreDomain, Domain, defineSettings } from "@palmares/core";
import { DatabasesDomain } from "@palmares/databases";
import { DrizzleDatabaseAdapter } from "@palmares/drizzle-engine";
import { drizzle as drizzleBetterSqlite3 } from "@palmares/drizzle-engine/better-sqlite3";
import { ExpressServerAdapter } from "@palmares/express-adapter";
import { loggingDomain as LoggingDomain } from "@palmares/logging";
import { NodeStd } from "@palmares/node-std";
import { SchemaDomain } from "@palmares/schemas";
import { Response, ServerDomain } from "@palmares/server";
import { ZodSchemaAdapter } from "@palmares/zod-schema";
import Database from "better-sqlite3";
import { dirname, resolve } from "path";
import ordersDomain from "./orders";
import * as schema from "../drizzle/schema";

const database = new Database("db.sqlite3");
export const drizzle = drizzleBetterSqlite3(database, { schema: schema });
export const databaseEngine = DrizzleDatabaseAdapter.new({
  output: "./drizzle/schema.ts",
  type: "better-sqlite3",
  drizzle,
});

// export const db = databaseEngine[1].instance.instance;

export default defineSettings({
  basePath: dirname(resolve(import.meta.dirname)),
  settingsLocation: import.meta.filename,
  std: NodeStd,
  installedDomains: [
    ordersDomain,
    [
      LoggingDomain,
      {
        logger: ConsoleLogging,
      },
    ],
    [
      CoreDomain,
      {
        appName: "server",
      },
    ],
    // Domain Core, required for palmares to work
    [
      ServerDomain,
      {
        servers: {
          default: {
            server: ExpressServerAdapter,
            debug: true,
            port: 3000,
            validation: {
              handler: () => {
                return Response.json({
                  message: "query params or url params invalid",
                });
              },
            },
            handler404: () =>
              Response.json({
                status: 404,
                body: {
                  message: "Not found",
                },
              }),
            handler500: async (response: any) => {
              return response;
            },
          },
        },
      },
    ],
    [
      SchemaDomain,
      {
        schemaAdapter: ZodSchemaAdapter,
      },
    ],
    [
      DatabasesDomain,
      {
        databases: {
          default: {
            engine: databaseEngine,
          },
        },
      },
    ],
  ],
});
