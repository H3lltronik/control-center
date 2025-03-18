import { Injectable } from "@nestjs/common";

import { CreateLogDto } from "../dtos/create-log.dto";
import { Log } from "../entities/log.entity";
import { LogRepository } from "../repositories/log.repository";

@Injectable()
export class LogService {
  constructor(private logRepository: LogRepository) {}

  async create(createLogDto: CreateLogDto): Promise<Log> {
    return this.logRepository.create(createLogDto);
  }
}
