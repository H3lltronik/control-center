import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";

import { ApiKeyEventType, ApiKeyLogEntity } from "./api-key-log.entity";

@Injectable()
export class ApiKeyLogRepository {
  constructor(
    @InjectRepository(ApiKeyLogEntity)
    private readonly repository: Repository<ApiKeyLogEntity>,
  ) {}

  async create(data: Partial<ApiKeyLogEntity>): Promise<ApiKeyLogEntity> {
    const log = this.repository.create(data);
    return this.repository.save(log);
  }

  async findById(uuid: string): Promise<ApiKeyLogEntity | null> {
    return this.repository.findOne({
      where: { uuid },
      relations: ["apiKey", "installation"],
    });
  }

  async findByApiKey(
    apiKeyUuid: string,
    limit = 50,
    offset = 0,
  ): Promise<ApiKeyLogEntity[]> {
    return this.repository.find({
      where: { apiKeyUuid },
      relations: ["installation"],
      order: { createdAt: "DESC" },
      take: limit,
      skip: offset,
    });
  }

  async findByInstallation(
    installationUuid: string,
    limit = 50,
    offset = 0,
  ): Promise<ApiKeyLogEntity[]> {
    return this.repository.find({
      where: { installationUuid },
      relations: ["apiKey"],
      order: { createdAt: "DESC" },
      take: limit,
      skip: offset,
    });
  }

  async findByEventType(
    eventType: ApiKeyEventType,
    limit = 50,
    offset = 0,
  ): Promise<ApiKeyLogEntity[]> {
    return this.repository.find({
      where: { eventType },
      relations: ["apiKey", "installation"],
      order: { createdAt: "DESC" },
      take: limit,
      skip: offset,
    });
  }

  async countByApiKeyAndEventType(
    apiKeyUuid: string,
    eventType: ApiKeyEventType,
    timeRange: { start: Date; end: Date },
  ): Promise<number> {
    return this.repository.count({
      where: {
        apiKeyUuid,
        eventType,
        createdAt: Between(timeRange.start, timeRange.end),
      },
    });
  }

  /**
   * Guarda un evento de API Key
   */
  async logEvent(data: {
    apiKeyUuid: string;
    installationUuid?: string;
    eventType: ApiKeyEventType;
    description?: string;
    ipAddress?: string;
    userAgent?: string;
    path?: string;
    statusCode?: number;
    metadata?: Record<string, unknown>;
  }): Promise<ApiKeyLogEntity> {
    const log = this.repository.create({
      apiKeyUuid: data.apiKeyUuid,
      installationUuid: data.installationUuid,
      eventType: data.eventType,
      description: data.description,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      path: data.path,
      statusCode: data.statusCode,
      metadata: data.metadata ?? {},
    });

    return this.repository.save(log);
  }
}
