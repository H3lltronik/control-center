import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { LogEntity } from "../../log.entity";
import { LogRepository } from "../../log.repository";
import { GetLogsQuery } from "./get-logs.query";

@QueryHandler(GetLogsQuery)
export class GetLogsHandler implements IQueryHandler<GetLogsQuery> {
  constructor(private readonly logRepository: LogRepository) {}

  async execute(query: GetLogsQuery): Promise<LogEntity[]> {
    return this.logRepository.findAll(query.filters);
  }
}
