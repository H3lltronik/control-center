import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, FindOptionsWhere, Repository } from "typeorm";

import { CreateLogDto } from "../../api/logs/dtos/create-log.dto";
import { GetLogsDto } from "../../api/logs/dtos/get-logs.dto";
import { LogEntity } from "./log.entity";

@Injectable()
export class LogRepository {
  constructor(
    @InjectRepository(LogEntity)
    private readonly repository: Repository<LogEntity>,
  ) {}

  async create(data: CreateLogDto): Promise<LogEntity> {
    const log = this.repository.create(data);
    return this.repository.save(log);
  }

  async findAll(filters: GetLogsDto): Promise<LogEntity[]> {
    const where: FindOptionsWhere<LogEntity> = {};

    if (filters.installationId) {
      where.installation = { uuid: filters.installationId };
    }

    if (filters.level) {
      where.level = filters.level;
    }

    if (filters.source) {
      where.source = filters.source;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.path) {
      where.path = filters.path;
    }

    if (filters.startDate && filters.endDate) {
      where.createdAt = Between(filters.startDate, filters.endDate);
    } else if (filters.startDate) {
      where.createdAt = Between(filters.startDate, new Date());
    }

    return this.repository.find({
      where,
      relations: ["installation"],
      order: { createdAt: "DESC" },
    });
  }
}
