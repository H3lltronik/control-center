import "reflect-metadata";

import { CommandFactory } from "nest-commander";

import { ApiKeyCommandModule } from "./commands/api-key/api-key-command.module";

async function bootstrap() {
  // Verificar si el comando es de ayuda
  const isHelpCommand = process.argv.some(
    arg => arg === "--help" || arg === "-h",
  );

  await CommandFactory.run(ApiKeyCommandModule, {
    logger: isHelpCommand ? ["error"] : ["error", "warn"],
  });
}

// Este es un archivo CLI, así que es apropiado usar process.exit
bootstrap().catch((error: unknown) => {
  console.error("CLI execution failed:", error);
  process.exit(1);
});
