import { Module } from "@nestjs/common";

import { ApiKeysDataModule } from "./api-keys/api-keys-data.module";
import { CustomersDataModule } from "./customers/customers-data.module";
import { InstallationsDataModule } from "./installations/installations-data.module";
import { LogsDataModule } from "./logs/logs-data.module";

@Module({
  imports: [
    ApiKeysDataModule,
    CustomersDataModule,
    InstallationsDataModule,
    LogsDataModule,
  ],
  exports: [
    ApiKeysDataModule,
    CustomersDataModule,
    InstallationsDataModule,
    LogsDataModule,
  ],
})
export class DataModule {}
