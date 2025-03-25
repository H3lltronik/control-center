import { Module } from "@nestjs/common";

import { CustomersCoreModule } from "./customers/customers-core.module";
import { InstallationsCoreModule } from "./installations/installations-core.module";
import { LogsCoreModule } from "./logs/logs-core.module";
import { SecurityCoreModule } from "./security/security-core.module";

@Module({
  imports: [
    CustomersCoreModule,
    InstallationsCoreModule,
    LogsCoreModule,
    SecurityCoreModule,
  ],
  exports: [
    CustomersCoreModule,
    InstallationsCoreModule,
    LogsCoreModule,
    SecurityCoreModule,
  ],
})
export class CoreModule {}
