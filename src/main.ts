import { Logger } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { AppModule } from "./app/app.module";
import { SecurityService } from "./app/core/security/security.service";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: ["error", "warn", "log", "debug", "verbose"],
    },
  );

  // Set up global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configure API prefix
  app.setGlobalPrefix("api");

  // Set up security features
  const securityService = app.get(SecurityService);
  securityService.setupSecurity(app.getHttpAdapter().getInstance());

  // Start the application
  const configService = app.get(ConfigService);
  const port =
    configService.get<string>("PORT") ??
    configService.get<string>("INTERNAL_PORT", "3000");

  await app.listen(port, "0.0.0.0");

  logger.log(`Central Control is ready and listening on port ${port} 🚀`);
}

bootstrap().catch(handleError);

function handleError(error: unknown) {
  // eslint-disable-next-line no-console
  console.error(error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}

process.on("uncaughtException", handleError);
