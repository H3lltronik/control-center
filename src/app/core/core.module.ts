import { Module } from "@nestjs/common";

import { ApiKeysCoreModule } from "./api-keys/api-keys-core.module";
import { CustomersCoreModule } from "./customers/customers-core.module";
import { InstallationsCoreModule } from "./installations/installations-core.module";
import { LogsCoreModule } from "./logs/logs-core.module";
import { SecurityCoreModule } from "./security/security-core.module";

@Module({
  imports: [
    ApiKeysCoreModule,
    CustomersCoreModule,
    InstallationsCoreModule,
    LogsCoreModule,
    SecurityCoreModule,
  ],
  exports: [
    ApiKeysCoreModule,
    CustomersCoreModule,
    InstallationsCoreModule,
    LogsCoreModule,
    SecurityCoreModule,
  ],
})
export class CoreModule {}
