import { Module } from "@nestjs/common";

import { ApiKeysApiModule } from "./api-keys/api-keys-api.module";
import { CustomersApiModule } from "./customers/customers-api.module";
import { HealthApiModule } from "./health/health-api.module";
import { InstallationsApiModule } from "./installations/installations-api.module";
import { LogsApiModule } from "./logs/logs-api.module";

@Module({
  imports: [
    ApiKeysApiModule,
    CustomersApiModule,
    HealthApiModule,
    InstallationsApiModule,
    LogsApiModule,
  ],
  exports: [
    ApiKeysApiModule,
    CustomersApiModule,
    HealthApiModule,
    InstallationsApiModule,
    LogsApiModule,
  ],
})
export class ApiModule {}
