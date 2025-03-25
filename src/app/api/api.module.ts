import { Module } from "@nestjs/common";

import { CustomersApiModule } from "./customers/customers-api.module";
import { HealthApiModule } from "./health/health-api.module";
import { InstallationsApiModule } from "./installations/installations-api.module";
import { LogsApiModule } from "./logs/logs-api.module";

@Module({
  imports: [
    CustomersApiModule,
    HealthApiModule,
    InstallationsApiModule,
    LogsApiModule,
  ],
  exports: [
    CustomersApiModule,
    HealthApiModule,
    InstallationsApiModule,
    LogsApiModule,
  ],
})
export class ApiModule {}
