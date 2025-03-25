import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { CreateLogDto } from "../../api/logs/dtos/create-log.dto";
import { GetLogsDto } from "../../api/logs/dtos/get-logs.dto";
import { CreateLogCommand } from "../../data/logs/commands/create-log/create-log.command";
import { LogEntity } from "../../data/logs/log.entity";
import { GetLogsQuery } from "../../data/logs/queries/get-logs/get-logs.query";

@Injectable()
export class LogService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(createLogDto: CreateLogDto): Promise<LogEntity> {
    return await this.commandBus.execute<CreateLogCommand, LogEntity>(
      new CreateLogCommand(createLogDto),
    );
  }

  async findAll(getLogsDto: GetLogsDto): Promise<LogEntity[]> {
    return await this.queryBus.execute<GetLogsQuery, LogEntity[]>(
      new GetLogsQuery(getLogsDto),
    );
  }
}
