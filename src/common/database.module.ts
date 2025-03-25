import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CustomerEntity } from "../app/data/customers/customer.entity";
import { InstallationEntity } from "../app/data/installations/installation.entity";
import { LogEntity } from "../app/data/logs/log.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get("NODE_ENV") === "production";
        const isDevelopment = configService.get("NODE_ENV") === "development";
        
        return {
          type: "postgres",
          host: configService.get("DB_HOST", "localhost"),
          port: configService.get("DB_PORT", 5432),
          username: configService.get("DB_USERNAME", "postgres"),
          password: configService.get("DB_PASSWORD", "postgres"),
          database: configService.get("DB_NAME", "postgres"),
          entities: [CustomerEntity, InstallationEntity, LogEntity],
          synchronize: isDevelopment && configService.get("DB_SYNC", "false") === "true",
          migrationsRun: isProduction,
          autoLoadEntities: false,
          ssl:
            configService.get("DB_SSL", "false") === "true"
              ? {
                  rejectUnauthorized:
                    configService.get("DB_REJECT_UNAUTHORIZED", "true") ===
                    "true",
                }
              : false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
