import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, LessThan, MoreThan, Repository } from "typeorm";

import { ApiKeyEntity, ApiKeyStatus } from "./api-key.entity";

@Injectable()
export class ApiKeyRepository {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly repository: Repository<ApiKeyEntity>,
  ) {}

  async create(data: Partial<ApiKeyEntity>): Promise<ApiKeyEntity> {
    const apiKey = this.repository.create(data);
    return this.repository.save(apiKey);
  }

  async findByKeyAndInstallation(
    key: string,
    installationUuid: string,
  ): Promise<ApiKeyEntity | null> {
    return this.repository.findOne({
      where: { key, installationUuid },
      relations: ["installation"],
    });
  }

  async findByUuid(uuid: string): Promise<ApiKeyEntity | null> {
    return this.repository.findOne({
      where: { uuid },
      relations: ["installation"],
    });
  }

  async findByInstallation(installationUuid: string): Promise<ApiKeyEntity[]> {
    return this.repository.find({
      where: { installationUuid },
      relations: ["installation"],
    });
  }

  async find(): Promise<ApiKeyEntity[]> {
    return this.repository.find({
      relations: ["installation"],
    });
  }

  async findActive(): Promise<ApiKeyEntity[]> {
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
    await this.repository.update({ uuid }, { lastUsedAt: new Date() });
  }

  async incrementRequestCount(uuid: string): Promise<void> {
    await this.repository.update(
      { uuid },
      { requestCount: () => "requestCount + 1" },
    );
  }

  async resetRequestCount(uuid: string): Promise<void> {
    await this.repository.update({ uuid }, { requestCount: 0 });
  }

  async revokeKey(uuid: string): Promise<ApiKeyEntity | null> {
    await this.repository.update({ uuid }, { status: ApiKeyStatus.REVOKED });
    return this.findByUuid(uuid);
  }

  async deleteKey(uuid: string): Promise<void> {
    await this.repository.delete({ uuid });
  }

  async markExpiredKeys(): Promise<number> {
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
