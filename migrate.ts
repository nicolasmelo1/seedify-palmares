import { migrate } from "@palmares/drizzle-engine/better-sqlite3/migrator";

import { drizzle } from "./src/settings";

migrate(drizzle, { migrationsFolder: "./drizzle/migrations" });
