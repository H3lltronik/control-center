import { GetLogsDto } from "../../../../api/logs/dtos/get-logs.dto";

export class GetLogsQuery {
  constructor(public readonly filters: GetLogsDto) {}
}
