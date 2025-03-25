import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { InstallationsDataModule } from "../installations/installations-data.module";
import { CreateLogHandler } from "./commands/create-log/create-log.handler";
import { LogEntity } from "./log.entity";
import { LogRepository } from "./log.repository";
import { GetLogsHandler } from "./queries/get-logs/get-logs.handler";

const CommandHandlers = [CreateLogHandler];
const QueryHandlers = [GetLogsHandler];

@Module({
  imports: [TypeOrmModule.forFeature([LogEntity]), InstallationsDataModule],
  providers: [LogRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [LogRepository],
})
export class LogsDataModule {}
