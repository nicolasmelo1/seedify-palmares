import { Commands } from "@palmares/core";

import settings from "./src/settings.test";

Commands.handleCommands(settings, process.argv.slice(2));
