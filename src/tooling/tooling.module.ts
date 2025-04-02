import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ApiKeysCoreModule } from "../app/core/api-keys/api-keys-core.module";
import { CustomersCoreModule } from "../app/core/customers/customers-core.module";
import { InstallationsCoreModule } from "../app/core/installations/installations-core.module";
import { DatabaseModule } from "../common/database.module";
import { ApiKeyEntity } from "../app/data/api-keys/api-key.entity";
import { ApiKeyInstallationEntity } from "../app/data/api-keys/api-key-installation.entity";
import { ApiKeyLogEntity } from "../app/data/api-keys/api-key-log.entity";
import { CustomerEntity } from "../app/data/customers/customer.entity";
import { InstallationEntity } from "../app/data/installations/installation.entity";
import { LogEntity } from "../app/data/logs/log.entity";

import { InteractiveCLICommand } from "./commands/interactive-cli.command";
import { SimpleTestCommand } from "./commands/simple-test.command";
import { ToolingApiKeyService } from "./services/tooling-api-key.service";
import { EnvironmentInfoService } from "./services/environment-info.service";
import { ToolingInstallationService } from "./services/tooling-installation.service";

@Module({
  imports: [
    // Import ConfigModule to load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env.tooling",
    }),
    // Import database module
    DatabaseModule,
    // Import core modules to use existing services
    ApiKeysCoreModule,
    CustomersCoreModule,
    InstallationsCoreModule,
    // Register entities
    TypeOrmModule.forFeature([
      CustomerEntity,
      InstallationEntity,
      ApiKeyEntity,
      ApiKeyInstallationEntity,
      ApiKeyLogEntity,
      LogEntity,
    ]),
  ],
  providers: [
    ToolingApiKeyService,
    EnvironmentInfoService,
    ToolingInstallationService,
    InteractiveCLICommand,
    SimpleTestCommand,
  ],
})
export class ToolingModule implements OnModuleInit {
  private readonly logger = new Logger(ToolingModule.name);
  
  onModuleInit() {
    // Display basic environment info when the module initializes
    this.logger.log("==========================================");
    this.logger.log("Current Environment Configuration:");
    this.logger.log("Loading environment from .env.tooling");
    this.logger.log("==========================================");
  }
}
