import { Logger } from "@nestjs/common";
import { config } from "dotenv";
import { CommandFactory } from "nest-commander";

import { ToolingModule } from "./tooling/tooling.module";

async function bootstrap(): Promise<void> {
  // Load environment variables from .env.tooling
  config({ path: ".env.tooling" });

  await CommandFactory.run(ToolingModule, {
    logger: new Logger(),
    errorHandler: (error: Error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1);
    },
  });
}

bootstrap().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start tooling application", error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
});
