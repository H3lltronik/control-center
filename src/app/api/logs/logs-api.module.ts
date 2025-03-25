import { Module } from "@nestjs/common";

import { LogsCoreModule } from "../../core/logs/logs-core.module";
import { LogsController } from "./logs.controller";

@Module({
  imports: [LogsCoreModule],
  controllers: [LogsController],
})
export class LogsApiModule {}
