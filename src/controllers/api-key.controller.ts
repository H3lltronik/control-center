import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import {
  ApiKeyResponseDto,
  ApiKeyVerificationResponseDto,
  VerifyApiKeyDto,
} from "../dtos/api-key.dto";
import { ApiKey } from "../entities/api-key.entity";
import { ApiKeyService } from "../services/api-key.service";

@Controller("api-keys")
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  /**
   * Get all API keys
   */
  @Get()
  async findAll(): Promise<ApiKeyResponseDto[]> {
    const apiKeys = await this.apiKeyService.findAll();
    return apiKeys.map(apiKey => this.mapToDto(apiKey));
  }

  /**
   * Get an API key by UUID
   */
  @Get(":uuid")
  async findOne(@Param("uuid") uuid: string): Promise<ApiKeyResponseDto> {
    const apiKey = await this.apiKeyService.findOneByUuid(uuid);
    return this.mapToDto(apiKey);
  }

  /**
   * Verify an API key
   */
  @Post("verify")
  async verify(
    @Body() verifyApiKeyDto: VerifyApiKeyDto,
  ): Promise<ApiKeyVerificationResponseDto> {
    const { key, system } = verifyApiKeyDto;
    const { isValid, apiKey } = await this.apiKeyService.verifyKey(key, system);

    return {
      isValid,
      uuid: apiKey?.uuid,
      metadata: apiKey?.metadata,
    };
  }

  /**
   * Map an API key entity to a response DTO
   */
  private mapToDto(apiKey: ApiKey): ApiKeyResponseDto {
    return {
      uuid: apiKey.uuid,
      name: apiKey.name,
      key: apiKey.key,
      allowedSystems: apiKey.allowedSystems,
      isActive: apiKey.isActive,
      lastUsedAt: apiKey.lastUsedAt?.toISOString(),
      expiresAt: apiKey.expiresAt?.toISOString(),
      createdAt: apiKey.createdAt.toISOString(),
      metadata: apiKey.metadata,
    };
  }
}
