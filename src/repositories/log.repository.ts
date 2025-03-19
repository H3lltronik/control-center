import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateLogDto } from "../dtos/create-log.dto";
import { Installation } from "../entities/installation.entity";
import { Log } from "../entities/log.entity";

@Injectable()
export class LogRepository {
  constructor(
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
    @InjectRepository(Installation)
    private installationRepository: Repository<Installation>,
  ) {}

  async create(
    createLogDto: CreateLogDto,
    installationId: string,
  ): Promise<Log> {
    // Find the installation entity by ID
    const installation = await this.installationRepository.findOneOrFail({
      where: { id: installationId },
    });

    // Create and save the log with the installation relationship
    const log = this.logRepository.create({
      ...createLogDto,
      installation,
    });
    return this.logRepository.save(log);
  }
}
