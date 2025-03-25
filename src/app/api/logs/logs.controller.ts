import { Body, Controller, Get, Post, Query } from "@nestjs/common";

import { LogService } from "../../core/logs/log.service";
import { LogEntity } from "../../data/logs/log.entity";
import { CreateLogDto } from "./dtos/create-log.dto";
import { GetLogsDto } from "./dtos/get-logs.dto";

@Controller("logs")
export class LogsController {
  constructor(private readonly logService: LogService) {}

  @Post()
  async create(@Body() createLogDto: CreateLogDto): Promise<LogEntity> {
    return this.logService.create(createLogDto);
  }

  @Get()
  async findAll(@Query() getLogsDto: GetLogsDto): Promise<LogEntity[]> {
    return this.logService.findAll(getLogsDto);
  }
}
