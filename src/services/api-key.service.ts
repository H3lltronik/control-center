import * as crypto from "node:crypto";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateApiKeyDto, UpdateApiKeyDto } from "../dtos/api-key.dto";
import { ApiKey } from "../entities/api-key.entity";

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}

  /**
   * Generate a random API key
   */
  private generateApiKey(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  /**
   * Create a new API key
   */
  async create(createApiKeyDto: CreateApiKeyDto): Promise<ApiKey> {
    const apiKey = this.apiKeyRepository.create({
      ...createApiKeyDto,
      key: this.generateApiKey(),
      expiresAt: createApiKeyDto.expiresAt
        ? new Date(createApiKeyDto.expiresAt)
        : undefined,
    });

    return this.apiKeyRepository.save(apiKey);
  }

  /**
   * Find all API keys
   */
  async findAll(): Promise<ApiKey[]> {
    return this.apiKeyRepository.find();
  }

  /**
   * Find an API key by UUID
   */
  async findOneByUuid(uuid: string): Promise<ApiKey> {
    const apiKey = await this.apiKeyRepository.findOne({ where: { uuid } });
    if (!apiKey) {
      throw new NotFoundException(`API key with UUID ${uuid} not found`);
    }
    return apiKey;
  }

  /**
   * Find an API key by key value
   */
  async findOneByKey(key: string): Promise<ApiKey | null> {
    return this.apiKeyRepository.findOne({ where: { key } });
  }

  /**
   * Update an API key
   */
  async update(
    uuid: string,
    updateApiKeyDto: UpdateApiKeyDto,
  ): Promise<ApiKey> {
    const apiKey = await this.findOneByUuid(uuid);

    // Handle date conversion if expiresAt is provided
    const updateData = {
      ...updateApiKeyDto,
      expiresAt: updateApiKeyDto.expiresAt
        ? new Date(updateApiKeyDto.expiresAt)
        : apiKey.expiresAt,
    };

    Object.assign(apiKey, updateData);
    return this.apiKeyRepository.save(apiKey);
  }

  /**
   * Delete an API key
   */
  async remove(uuid: string): Promise<void> {
    const apiKey = await this.findOneByUuid(uuid);
    await this.apiKeyRepository.softRemove(apiKey);
  }

  /**
   * Regenerate an API key
   */
  async regenerateKey(uuid: string): Promise<ApiKey> {
    const apiKey = await this.findOneByUuid(uuid);
    apiKey.key = this.generateApiKey();
    return this.apiKeyRepository.save(apiKey);
  }

  /**
   * Verify an API key for a specific system
   */
  async verifyKey(
    key: string,
    system: string,
  ): Promise<{ isValid: boolean; apiKey?: ApiKey }> {
    const apiKey = await this.findOneByKey(key);

    if (!apiKey) {
      return { isValid: false };
    }

    // Check if the API key is active and not expired
    const now = new Date();
    const isActive = apiKey.isActive;
    const isNotExpired = !apiKey.expiresAt || apiKey.expiresAt > now;
    const hasSystemAccess = apiKey.allowedSystems.includes(system);

    const isValid = isActive && isNotExpired && hasSystemAccess;

    // Update lastUsedAt if the key is valid
    if (isValid) {
      apiKey.lastUsedAt = now;
      await this.apiKeyRepository.save(apiKey);
    }

    return {
      isValid,
      apiKey: isValid ? apiKey : undefined,
    };
  }
}
