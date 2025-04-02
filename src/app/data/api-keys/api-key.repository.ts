import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, LessThan, MoreThan, Repository } from "typeorm";

import { ApiKeyEntity, ApiKeyStatus } from "./api-key.entity";

@Injectable()
export class ApiKeyRepository {
  private readonly logger = new Logger(ApiKeyRepository.name);

  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly repository: Repository<ApiKeyEntity>,
  ) {}

  async create(data: Partial<ApiKeyEntity>): Promise<ApiKeyEntity> {
    this.logger.log(`Creating API key: ${JSON.stringify(data)}`);
    const apiKey = this.repository.create(data);
    return this.repository.save(apiKey);
  }

  async findByKeyAndInstallation(
    key: string,
    installationUuid: string,
  ): Promise<ApiKeyEntity | null> {
    this.logger.log(
      `Finding API key by key: ${key} and installationUuid: ${installationUuid}`,
    );
    const apiKey = await this.repository.findOne({
      where: { key, installationUuid },
      relations: ["installation"],
    });
    return apiKey;
  }

  async findByUuid(uuid: string): Promise<ApiKeyEntity | null> {
    this.logger.log(`Finding API key by uuid: ${uuid}`);
    return this.repository.findOne({
      where: { uuid },
      relations: ["installation"],
    });
  }

  async findByInstallation(installationUuid: string): Promise<ApiKeyEntity[]> {
    this.logger.log(`Finding API key by installationUuid: ${installationUuid}`);
    return this.repository.find({
      where: { installationUuid },
      relations: ["installation"],
    });
  }

  async find(): Promise<ApiKeyEntity[]> {
    this.logger.log(`Finding all API keys`);
    return this.repository.find({
      relations: ["installation"],
    });
  }

  async findActive(): Promise<ApiKeyEntity[]> {
    this.logger.log(`Finding active API keys`);
    const now = new Date();
    return this.repository.find({
      where: [
        { status: ApiKeyStatus.ACTIVE, expiresAt: IsNull() },
        { status: ApiKeyStatus.ACTIVE, expiresAt: MoreThan(now) },
      ],
      relations: ["installation"],
    });
  }

  async updateLastUsed(uuid: string): Promise<void> {
    this.logger.log(`Updating last used for API key: ${uuid}`);
    await this.repository.update({ uuid }, { lastUsedAt: new Date() });
  }

  async incrementRequestCount(uuid: string): Promise<void> {
    this.logger.log(`Incrementing request count for API key: ${uuid}`);
    await this.repository.update(
      { uuid },
      { requestCount: () => "requestCount + 1" },
    );
  }

  async resetRequestCount(uuid: string): Promise<void> {
    this.logger.log(`Resetting request count for API key: ${uuid}`);
    await this.repository.update({ uuid }, { requestCount: 0 });
  }

  async revokeKey(uuid: string): Promise<ApiKeyEntity | null> {
    this.logger.log(`Revoking API key: ${uuid}`);
    await this.repository.update({ uuid }, { status: ApiKeyStatus.REVOKED });
    return this.findByUuid(uuid);
  }

  async deleteKey(uuid: string): Promise<void> {
    this.logger.log(`Deleting API key: ${uuid}`);
    await this.repository.delete({ uuid });
  }

  async markExpiredKeys(): Promise<number> {
    this.logger.log(`Marking expired keys`);
    const now = new Date();
    const result = await this.repository.update(
      {
        status: ApiKeyStatus.ACTIVE,
        expiresAt: LessThan(now),
      },
      { status: ApiKeyStatus.EXPIRED },
    );
    return result.affected ?? 0;
  }
}
