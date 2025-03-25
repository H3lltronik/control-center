import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { LogsDataModule } from "../../data/logs/logs-data.module";
import { LogService } from "./log.service";

@Module({
  imports: [CqrsModule, LogsDataModule],
  providers: [LogService],
  exports: [LogService],
})
export class LogsCoreModule {}
