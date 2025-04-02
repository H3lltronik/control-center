import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {
  ApiKeyInstallationEntity,
  ApiKeyPermission,
} from "./api-key-installation.entity";

@Injectable()
export class ApiKeyInstallationRepository {
  private readonly logger = new Logger(ApiKeyInstallationRepository.name);

  constructor(
    @InjectRepository(ApiKeyInstallationEntity)
    private readonly repository: Repository<ApiKeyInstallationEntity>,
  ) {}

  /**
   * Crea una nueva relación entre API Key e Instalación
   */
  async create(data: {
    apiKeyUuid: string;
    installationUuid: string;
    permission: ApiKeyPermission;
    rateLimit?: number;
  }): Promise<ApiKeyInstallationEntity> {
    this.logger.log(`Creating API key installation: ${JSON.stringify(data)}`);
    const apiKeyInstallation = this.repository.create({
      apiKeyUuid: data.apiKeyUuid,
      installationUuid: data.installationUuid,
      permission: data.permission,
      rateLimit: data.rateLimit ?? 100, // Default: 100 RPM
    });

    this.logger.log(
      `API key installation created: ${JSON.stringify(apiKeyInstallation)}`,
    );

    return this.repository.save(apiKeyInstallation);
  }

  /**
   * Encuentra una relación por su UUID
   */
  async findById(uuid: string): Promise<ApiKeyInstallationEntity | null> {
    this.logger.log(`Finding API key installation by uuid: ${uuid}`);
    return this.repository.findOne({
      where: { uuid },
      relations: ["apiKey", "installation"],
    });
  }

  /**
   * Encuentra una relación entre API Key e Instalación
   */
  async findByApiKeyAndInstallation(
    apiKeyUuid: string,
    installationUuid: string,
  ): Promise<ApiKeyInstallationEntity | null> {
    this.logger.log(
      `Finding API key installation by apiKeyUuid: ${apiKeyUuid} and installationUuid: ${installationUuid}`,
    );
    return this.repository.findOne({
      where: {
        apiKeyUuid,
        installationUuid,
      },
      relations: ["apiKey", "installation"],
    });
  }

  /**
   * Actualiza el permiso de una relación
   */
  async updatePermission(
    uuid: string,
    permission: ApiKeyPermission,
  ): Promise<void> {
    this.logger.log(
      `Updating permission for API key installation: ${uuid} to ${permission}`,
    );
    await this.repository.update(uuid, { permission });
  }

  /**
   * Elimina una relación
   */
  async delete(uuid: string): Promise<void> {
    this.logger.log(`Deleting API key installation: ${uuid}`);
    await this.repository.delete(uuid);
  }

  /**
   * Incrementa el contador de peticiones y actualiza la fecha de último uso
   */
  async updateRequestCount(uuid: string): Promise<void> {
    this.logger.log(
      `Incrementing request count for API key installation: ${uuid}`,
    );
    await this.repository.increment({ uuid }, "requestCount", 1);
    await this.repository.update(uuid, { lastUsedAt: new Date() });
  }

  /**
   * Reinicia el contador de peticiones
   */
  async resetRequestCount(uuid: string): Promise<void> {
    this.logger.log(
      `Resetting request count for API key installation: ${uuid}`,
    );
    await this.repository.update(uuid, { requestCount: 0 });
  }
}
