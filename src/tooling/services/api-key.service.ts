import * as crypto from "node:crypto";

import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {
  ApiKeyEntity,
  ApiKeyStatus,
} from "../../app/data/api-keys/api-key.entity";
import {
  ApiKeyInstallationEntity,
  ApiKeyPermission,
} from "../../app/data/api-keys/api-key-installation.entity";
import { InstallationEntity } from "../../app/data/installations/installation.entity";

@Injectable()
export class ApiKeyService {
  private readonly logger = new Logger(ApiKeyService.name);

  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly apiKeyRepository: Repository<ApiKeyEntity>,
    @InjectRepository(ApiKeyInstallationEntity)
    private readonly apiKeyInstallationRepository: Repository<ApiKeyInstallationEntity>,
    @InjectRepository(InstallationEntity)
    private readonly installationRepository: Repository<InstallationEntity>,
  ) {}

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
    // Verify that the installation exists
    const installation = await this.installationRepository.findOne({
      where: { id: installationId },
    });

    if (!installation) {
      throw new Error(`Installation with ID ${installationId} not found`);
    }

    this.logger.log(
      `Generating API key for installation ${installation.productName}`,
    );

    // Create the API key
    const apiKey = this.apiKeyRepository.create({
      key: this.generateApiKeyString(),
      name,
      description,
      status: ApiKeyStatus.ACTIVE,
      expiresAt: expiresInDays
        ? this.calculateExpiryDate(expiresInDays)
        : undefined,
      createdBy: "tooling-cli",
      rateLimit: rateLimit ?? 300,
      installationUuid: installation.id,
    });

    // Save the API key
    const savedApiKey = await this.apiKeyRepository.save(apiKey);
    this.logger.log(`API key created with UUID ${savedApiKey.uuid}`);

    // Create the relationship with the installation
    const apiKeyInstallation = this.apiKeyInstallationRepository.create({
      apiKeyUuid: savedApiKey.uuid,
      installationUuid: installation.id,
      permission,
      rateLimit: rateLimit ?? 100,
    });

    await this.apiKeyInstallationRepository.save(apiKeyInstallation);
    this.logger.log(
      `API key has been linked to installation ${installation.productName}`,
    );

    return savedApiKey;
  }

  /**
   * Lists all available API keys
   */
  async listApiKeys(): Promise<ApiKeyEntity[]> {
    return this.apiKeyRepository.find({
      relations: ["installation", "apiKeyInstallations"],
    });
  }

  /**
   * Formats API keys for display in the console
   */
  formatApiKeysForDisplay(apiKeys: ApiKeyEntity[]): string {
    if (apiKeys.length === 0) {
      return "No API keys found.";
    }

    let output = "\nAVAILABLE API KEYS:\n";
    output +=
      "===================================================================================\n";
    output +=
      "UUID                                | KEY                     | NAME             | STATUS | INSTALLATION ID | EXPIRES AT\n";
    output +=
      "-----------------------------------------------------------------------------------\n";

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
    output +=
      "===================================================================================\n";

    return output;
  }

  /**
   * Generates a random string for the API key
   */
  private generateApiKeyString(): string {
    return `pk_${crypto.randomBytes(24).toString("hex")}`;
  }

  /**
   * Calculates the expiry date based on days
   */
  private calculateExpiryDate(days: number): Date {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    return expiryDate;
  }
}
