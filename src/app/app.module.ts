import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DatabaseModule } from "../common/database.module";
import { LoggerModule } from "../common/logger.module";
import { SecurityService } from "../common/security.service";
import { ApiKeyModule } from "../modules/api-key.module";
import { CustomerModule } from "../modules/customer.module";
import { HealthModule } from "../modules/health.module";
import { InstallationModule } from "../modules/installation.module";
import { LogModule } from "../modules/log.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    LoggerModule,
    DatabaseModule,
    ApiKeyModule,
    CustomerModule,
    InstallationModule,
    LogModule,
    HealthModule,
  ],
  providers: [SecurityService],
  exports: [SecurityService],
})
export class AppModule {}
