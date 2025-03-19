import { Body, Controller, Headers, Post } from "@nestjs/common";

import { CreateLogDto } from "../dtos/create-log.dto";
import { Log } from "../entities/log.entity";
import { LogService } from "../services/log.service";

@Controller("logs")
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Post()
  create(
    @Body() createLogDto: CreateLogDto,
    @Headers("x-installation-id") installationId: string,
  ): Promise<Log> {
    return this.logService.create(createLogDto, installationId);
  }
}
