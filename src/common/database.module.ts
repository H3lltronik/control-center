import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ApiKey } from "../entities/api-key.entity";
import { Customer } from "../entities/customer.entity";
import { Installation } from "../entities/installation.entity";
import { Log } from "../entities/log.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("DATABASE_HOST", "localhost"),
        port: configService.get<number>("DATABASE_INTERNAL_PORT", 5432),
        username: configService.get<string>("DATABASE_USER", "postgres"),
        password: configService.get<string>("DATABASE_PASSWORD", "postgres"),
        database: configService.get<string>("DATABASE_NAME", "central_control"),
        entities: [ApiKey, Customer, Installation, Log],
        synchronize: configService.get<boolean>("DATABASE_SYNC", false),
        logging: configService.get<string>("NODE_ENV") === "development",
      }),
    }),
  ],
})
export class DatabaseModule {}
