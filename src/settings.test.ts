import { defineSettings } from "@palmares/core";
import { TestDomain } from "@palmares/tests";
import { JestTestAdapter } from "@palmares/jest-tests";
import { dirname, join, resolve } from "path";

import mainSettings from "./settings";

export default defineSettings({
  ...mainSettings,
  installedDomains: [
    ...mainSettings.installedDomains,
    [
      TestDomain,
      {
        testAdapter: JestTestAdapter.new({
          config: {
            extensionsToTreatAsEsm: [".ts"],
            transform: {
              // '^.+\\.[tj]sx?$' to process ts,js,tsx,jsx with `ts-jest`
              // '^.+\\.m?[tj]sx?$' to process ts,js,tsx,jsx,mts,mjs,mtsx,mjsx with `ts-jest`
              "^.+\\.ts?$": [
                "ts-jest",
                {
                  tsconfig: join(
                    dirname(resolve(import.meta.dirname)),
                    "tsconfig.json",
                  ),
                  useESM: true,
                  diagnostics: {
                    ignoreCodes: [1343],
                  },
                  astTransformers: {
                    before: [
                      {
                        path: "node_modules/ts-jest-mock-import-meta",
                        options: {
                          metaObjectReplacement: {
                            filename: import.meta.filename,
                            dirname: import.meta.dirname,
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        }),
      },
    ],
  ],
});
