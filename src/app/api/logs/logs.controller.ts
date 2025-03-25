import { Body, Controller, Get, Headers, Post, Query } from "@nestjs/common";

import { LogService } from "../../core/logs/log.service";
import { LogEntity } from "../../data/logs/log.entity";
import { CreateLogDto } from "./dtos/create-log.dto";
import { GetLogsDto } from "./dtos/get-logs.dto";

@Controller("logs")
export class LogsController {
  constructor(private readonly logService: LogService) {}

  @Post()
  create(
    @Body() createLogDto: CreateLogDto,
    @Headers("x-installation-id") installationId: string,
  ): Promise<LogEntity> {
    return this.logService.create(createLogDto, installationId);
  }

  @Get()
  async findAll(@Query() getLogsDto: GetLogsDto): Promise<LogEntity[]> {
    return this.logService.findAll(getLogsDto);
  }
}
