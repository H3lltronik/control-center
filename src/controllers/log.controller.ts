import { Body, Controller, Post } from "@nestjs/common";

import { CreateLogDto } from "../dtos/create-log.dto";
import { Log } from "../entities/log.entity";
import { LogService } from "../services/log.service";

@Controller("logs")
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Post()
  create(@Body() createLogDto: CreateLogDto): Promise<Log> {
    return this.logService.create(createLogDto);
  }
}
