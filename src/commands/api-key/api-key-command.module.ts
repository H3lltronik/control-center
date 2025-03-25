import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ApiKey } from "../../entities/api-key.entity";
import { Customer } from "../../entities/customer.entity";
import { Installation } from "../../entities/installation.entity";
import { Log } from "../../entities/log.entity";
import { CreateApiKeyCommand } from "./create-api-key.command";

// Determinar qué archivo .env cargar
const envFilePath =
  process.env.NODE_ENV === "local" ? [".env.local", ".env"] : ".env";

// Verificar si el comando es de ayuda
const isHelpCommand = process.argv.some(
  arg => arg === "--help" || arg === "-h",
);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    // Solo configuramos TypeORM si no estamos en modo ayuda
    ...(isHelpCommand
      ? []
      : [
          TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.DATABASE_HOST ?? "localhost",
            port: Number(process.env.DATABASE_INTERNAL_PORT ?? 5432),
            username: process.env.DATABASE_USER ?? "postgres",
            password: process.env.DATABASE_PASSWORD ?? "postgres",
            database: process.env.DATABASE_NAME ?? "central_control",
            entities: [ApiKey, Customer, Installation, Log],
            synchronize: false,
          }),
          TypeOrmModule.forFeature([ApiKey]),
        ]),
  ],
  providers: [CreateApiKeyCommand],
})
export class ApiKeyCommandModule {}
