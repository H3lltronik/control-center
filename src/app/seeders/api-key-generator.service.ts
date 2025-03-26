import * as crypto from "node:crypto";

import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ApiKeyEntity, ApiKeyStatus } from "../data/api-keys/api-key.entity";
import {
  ApiKeyInstallationEntity,
  ApiKeyPermission,
} from "../data/api-keys/api-key-installation.entity";
import { InstallationEntity } from "../data/installations/installation.entity";

@Injectable()
export class ApiKeyGeneratorService {
  private readonly logger = new Logger(ApiKeyGeneratorService.name);

  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly apiKeyRepository: Repository<ApiKeyEntity>,
    @InjectRepository(ApiKeyInstallationEntity)
    private readonly apiKeyInstallationRepository: Repository<ApiKeyInstallationEntity>,
    @InjectRepository(InstallationEntity)
    private readonly installationRepository: Repository<InstallationEntity>,
  ) {}

  /**
   * Genera una API key para una instalación específica
   */
  async generateApiKey(
    installationId: string,
    name: string,
    description?: string,
    expiresInDays?: number,
    rateLimit?: number,
    permission: ApiKeyPermission = ApiKeyPermission.READ,
  ): Promise<ApiKeyEntity> {
    // Verificar que la instalación existe
    const installation = await this.installationRepository.findOne({
      where: { id: installationId },
    });

    if (!installation) {
      throw new Error(`Installation with ID ${installationId} not found`);
    }

    this.logger.log(
      `Generating API key for installation ${installation.productName}`,
    );

    // Crear la API key
    const apiKey = this.apiKeyRepository.create({
      key: this.generateApiKeyString(),
      name,
      description,
      status: ApiKeyStatus.ACTIVE,
      expiresAt: expiresInDays
        ? this.calculateExpiryDate(expiresInDays)
        : undefined,
      createdBy: "manual-command",
      rateLimit: rateLimit ?? 300,
      installationUuid: installation.id,
    });

    // Guardar la API key
    const savedApiKey = await this.apiKeyRepository.save(apiKey);
    this.logger.log(`API key created with UUID ${savedApiKey.uuid}`);

    // Crear la relación con la instalación
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
   * Lista todas las API keys disponibles
   */
  async listApiKeys(): Promise<ApiKeyEntity[]> {
    return this.apiKeyRepository.find({
      relations: ["installation", "apiKeyInstallations"],
    });
  }

  /**
   * Genera un string aleatorio para la API key
   */
  private generateApiKeyString(): string {
    return `pk_${crypto.randomBytes(24).toString("hex")}`;
  }

  /**
   * Calcula la fecha de expiración basada en los días
   */
  private calculateExpiryDate(days: number): Date {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    return expiryDate;
  }
}
