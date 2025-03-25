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

  async create(
    createLogDto: CreateLogDto,
    installationId: string,
  ): Promise<LogEntity> {
    return await this.commandBus.execute<CreateLogCommand, LogEntity>(
      new CreateLogCommand({
        content: createLogDto.content,
        level: createLogDto.level,
        metadata: createLogDto.metadata,
        path: createLogDto.path,
        source: createLogDto.source,
        userId: createLogDto.userId,
        userAgent: createLogDto.userAgent,
        ipAddress: createLogDto.ipAddress,
        stackTrace: createLogDto.stackTrace,
        installationId,
      }),
    );
  }

  async findAll(getLogsDto: GetLogsDto): Promise<LogEntity[]> {
    return await this.queryBus.execute<GetLogsQuery, LogEntity[]>(
      new GetLogsQuery(getLogsDto),
    );
  }
}
