import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ApiKeyService } from "../../app/core/api-keys/api-key.service";
import { ApiKeyEntity } from "../../app/data/api-keys/api-key.entity";
import { ApiKeyPermission } from "../../app/data/api-keys/api-key-installation.entity";

@Injectable()
export class ToolingApiKeyService {
  private readonly logger = new Logger(ToolingApiKeyService.name);

  constructor(
    @Inject(ApiKeyService)
    private readonly apiKeyService: ApiKeyService,
    @InjectRepository(ApiKeyEntity)
    private readonly apiKeyRepository: Repository<ApiKeyEntity>,
  ) {}

  /**
   * Lists all API keys
   */
  async listApiKeys(): Promise<ApiKeyEntity[]> {
    return this.apiKeyRepository.find({
      relations: ["installation", "apiKeyInstallations"],
    });
  }

  /**
   * Generates an API key for a specific installation
   */
  async generateApiKey(
    installationId: string,
    name: string,
    description?: string,
    expiresInDays?: number,
    rateLimit?: number,
    permission: ApiKeyPermission = ApiKeyPermission.READ,
  ): Promise<ApiKeyEntity> {
    const { apiKey } = await this.apiKeyService.createApiKey({
      name,
      description,
      installationUuid: installationId,
      expiresAt: expiresInDays ? this.calculateExpiryDate(expiresInDays) : undefined,
      createdBy: "tooling-cli",
      rateLimit,
      permission,
    });

    return apiKey;
  }

  /**
   * Calculates the expiry date based on days
   */
  private calculateExpiryDate(days: number): Date {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    return expiryDate;
  }

  /**
   * Formats API keys for display in the console
   */
  formatApiKeysForDisplay(apiKeys: ApiKeyEntity[]): string {
    if (apiKeys.length === 0) {
      return "No API keys found.";
    }

    let output = "\nAVAILABLE API KEYS:\n";
    output += "===================================================================================\n";
    output += "UUID                                | KEY                     | NAME             | STATUS | INSTALLATION ID | EXPIRES AT\n";
    output += "-----------------------------------------------------------------------------------\n";

    for (const apiKey of apiKeys) {
      // Truncate key for display
      const truncatedKey = `${apiKey.key.slice(0, 20)}...`;
      const name =
        apiKey.name.length > 15
          ? `${apiKey.name.slice(0, 12)}...`
          : apiKey.name.padEnd(15);
      const expiresAt = apiKey.expiresAt
        ? apiKey.expiresAt.toISOString().split("T")[0]
        : "Never";

      output += `${apiKey.uuid} | ${truncatedKey.padEnd(24)} | ${name} | ${apiKey.status.padEnd(6)} | ${apiKey.installationUuid || "N/A"} | ${expiresAt}\n`;
    }
    output += "===================================================================================\n";

    return output;
  }
} 