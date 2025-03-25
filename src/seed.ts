import { Logger } from "@nestjs/common";
import { config } from "dotenv";
import { CommandFactory } from "nest-commander";

import { SeederModule } from "./app/seeders/seeder-module";

async function bootstrap(): Promise<void> {
  // Cargamos las variables de entorno desde .env.seeder
  config({ path: ".env.seeder" });

  await CommandFactory.run(SeederModule, {
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
  console.error("Failed to start application", error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
});
