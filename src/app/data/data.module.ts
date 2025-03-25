import { Module } from "@nestjs/common";

import { CustomersDataModule } from "./customers/customers-data.module";
import { InstallationsDataModule } from "./installations/installations-data.module";
import { LogsDataModule } from "./logs/logs-data.module";

@Module({
  imports: [CustomersDataModule, InstallationsDataModule, LogsDataModule],
  exports: [CustomersDataModule, InstallationsDataModule, LogsDataModule],
})
export class DataModule {}
