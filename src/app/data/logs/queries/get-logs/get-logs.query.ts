import { IQuery } from "@nestjs/cqrs";

import { GetLogsDto } from "../../../../api/logs/dtos/get-logs.dto";

export class GetLogsQuery implements IQuery {
  constructor(public readonly filters: GetLogsDto) {}
}
