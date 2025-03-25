import { CreateLogDto } from "../../../../api/logs/dtos/create-log.dto";

export class CreateLogCommand {
  constructor(public readonly data: CreateLogDto) {}
}
