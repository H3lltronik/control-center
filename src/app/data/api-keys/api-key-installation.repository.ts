import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {
  ApiKeyInstallationEntity,
  ApiKeyPermission,
} from "./api-key-installation.entity";

@Injectable()
export class ApiKeyInstallationRepository {
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
    const apiKeyInstallation = this.repository.create({
      apiKeyUuid: data.apiKeyUuid,
      installationUuid: data.installationUuid,
      permission: data.permission,
      rateLimit: data.rateLimit ?? 100, // Default: 100 RPM
    });

    return this.repository.save(apiKeyInstallation);
  }

  /**
   * Encuentra una relación por su UUID
   */
  async findById(uuid: string): Promise<ApiKeyInstallationEntity | null> {
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
    await this.repository.update(uuid, { permission });
  }

  /**
   * Elimina una relación
   */
  async delete(uuid: string): Promise<void> {
    await this.repository.delete(uuid);
  }

  /**
   * Incrementa el contador de peticiones y actualiza la fecha de último uso
   */
  async updateRequestCount(uuid: string): Promise<void> {
    await this.repository.increment({ uuid }, "requestCount", 1);
    await this.repository.update(uuid, { lastUsedAt: new Date() });
  }

  /**
   * Reinicia el contador de peticiones
   */
  async resetRequestCount(uuid: string): Promise<void> {
    await this.repository.update(uuid, { requestCount: 0 });
  }
}
