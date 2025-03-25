import * as crypto from "node:crypto";

import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";

import { ApiKeyEntity, ApiKeyStatus } from "../../data/api-keys/api-key.entity";
import { ApiKeyRepository } from "../../data/api-keys/api-key.repository";
import {
  ApiKeyInstallationEntity,
  ApiKeyPermission,
} from "../../data/api-keys/api-key-installation.entity";
import { ApiKeyInstallationRepository } from "../../data/api-keys/api-key-installation.repository";
import {
  ApiKeyEventType,
  ApiKeyLogEntity,
} from "../../data/api-keys/api-key-log.entity";
import { ApiKeyLogRepository } from "../../data/api-keys/api-key-log.repository";
import { InstallationRepository } from "../../data/installations/installation.repository";

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
  path?: string;
}

@Injectable()
export class ApiKeyService {
  private readonly logger = new Logger(ApiKeyService.name);

  constructor(
    private readonly apiKeyRepository: ApiKeyRepository,
    private readonly installationRepository: InstallationRepository,
    private readonly apiKeyInstallationRepository: ApiKeyInstallationRepository,
    private readonly apiKeyLogRepository: ApiKeyLogRepository,
  ) {}

  /**
   * Genera una clave API segura
   * @returns String con formato "prefix.randomBytes"
   */
  private generateApiKey(prefix = "cc"): string {
    // Generamos 32 bytes aleatorios y los codificamos en base64
    const randomBytes = crypto.randomBytes(32).toString("base64url");
    // Usamos un prefijo reconocible seguido de un punto y los bytes aleatorios
    return `${prefix}.${randomBytes}`;
  }

  /**
   * Crea una nueva API Key
   */
  async createApiKey(data: {
    name: string;
    description?: string;
    installationUuid?: string;
    expiresAt?: Date;
    createdBy?: string;
    metadata?: Record<string, unknown>;
    rateLimit?: number;
    permission?: ApiKeyPermission;
    requestContext?: RequestContext;
  }): Promise<{ apiKey: ApiKeyEntity; secretKey: string }> {
    // Verificar installation si se proporcionó
    if (data.installationUuid) {
      const installation = await this.installationRepository.findByUuid(
        data.installationUuid,
      );
      if (!installation) {
        throw new NotFoundException(
          `Installation with UUID ${data.installationUuid} not found`,
        );
      }
    }

    // Generar la clave API segura
    const secretKey = this.generateApiKey();

    // Crear y guardar la entidad
    const apiKey = await this.apiKeyRepository.create({
      key: secretKey,
      name: data.name,
      description: data.description,
      installationUuid: data.installationUuid,
      expiresAt: data.expiresAt,
      createdBy: data.createdBy,
      metadata: data.metadata ?? {},
      status: ApiKeyStatus.ACTIVE,
      rateLimit: data.rateLimit ?? 300, // Default 300 RPM
    });

    // Si se especificó una instalación, crear la relación con permisos
    if (data.installationUuid) {
      await this.apiKeyInstallationRepository.create({
        apiKeyUuid: apiKey.uuid,
        installationUuid: data.installationUuid,
        permission: data.permission ?? ApiKeyPermission.READ,
        rateLimit: data.rateLimit ?? 100, // Default 100 RPM por instalación
      });
    }

    // Registrar el evento de creación
    await this.apiKeyLogRepository.logEvent({
      apiKeyUuid: apiKey.uuid,
      installationUuid: data.installationUuid,
      eventType: ApiKeyEventType.CREATED,
      description: `API Key created for ${data.name}`,
      ipAddress: data.requestContext?.ipAddress,
      userAgent: data.requestContext?.userAgent,
      path: data.requestContext?.path,
      metadata: { createdBy: data.createdBy },
    });

    this.logger.log(`API Key created: ${apiKey.uuid}`);

    // Devolver la entidad y la clave secreta
    return { apiKey, secretKey };
  }

  /**
   * Valida si una API Key es válida, verifica que tenga permiso para acceder
   * a una instalación específica y realiza control de tasa (rate limiting)
   */
  async validateApiKey(
    key: string,
    installationUuid?: string,
    requiredPermission: ApiKeyPermission = ApiKeyPermission.READ,
    requestContext?: RequestContext,
  ): Promise<{
    isValid: boolean;
    apiKey?: ApiKeyEntity;
    installation?: ApiKeyInstallationEntity;
  }> {
    if (!key) {
      await this.logFailedValidation(
        undefined,
        undefined,
        "No API key provided",
        requestContext,
      );
      return { isValid: false };
    }

    try {
      // Buscar la API Key
      const apiKey = await this.apiKeyRepository.findByKey(key);

      if (!apiKey) {
        await this.logFailedValidation(
          undefined,
          installationUuid,
          "API key not found",
          requestContext,
        );
        return { isValid: false };
      }

      // Verificar si la API Key es válida (activa y no expirada)
      if (!apiKey.isValid()) {
        await this.logFailedValidation(
          apiKey.uuid,
          installationUuid,
          `API key is ${apiKey.status === ApiKeyStatus.REVOKED ? "revoked" : "expired"}`,
          requestContext,
        );
        return { isValid: false };
      }

      // Si no se especificó una instalación, solo verificamos que la API Key sea válida
      if (!installationUuid) {
        // Actualizar fecha de último uso y contador
        await this.apiKeyRepository.updateLastUsed(apiKey.uuid);
        await this.apiKeyRepository.incrementRequestCount(apiKey.uuid);

        // Registrar evento de validación exitosa
        await this.apiKeyLogRepository.logEvent({
          apiKeyUuid: apiKey.uuid,
          eventType: ApiKeyEventType.VALIDATED,
          description: "API key validated without installation check",
          ipAddress: requestContext?.ipAddress,
          userAgent: requestContext?.userAgent,
          path: requestContext?.path,
        });

        return { isValid: true, apiKey };
      }

      // Verificar instalación y permisos
      const apiKeyInstallation =
        await this.apiKeyInstallationRepository.findByApiKeyAndInstallation(
          apiKey.uuid,
          installationUuid,
        );

      // Si no hay relación, verificar si la API Key tiene acceso a la instalación vía compatibilidad
      if (!apiKeyInstallation) {
        // Si la API Key fue creada para una instalación específica y es diferente, no permitir
        if (
          apiKey.installationUuid &&
          apiKey.installationUuid !== installationUuid
        ) {
          await this.logFailedValidation(
            apiKey.uuid,
            installationUuid,
            "API key does not have access to this installation",
            requestContext,
          );
          return { isValid: false };
        }

        // Si no tiene instalación asociada, permitir acceso (para compatibilidad)
        await this.apiKeyRepository.updateLastUsed(apiKey.uuid);
        await this.apiKeyRepository.incrementRequestCount(apiKey.uuid);

        // Registrar evento de validación exitosa
        await this.apiKeyLogRepository.logEvent({
          apiKeyUuid: apiKey.uuid,
          installationUuid,
          eventType: ApiKeyEventType.VALIDATED,
          description: "API key validated with legacy installation check",
          ipAddress: requestContext?.ipAddress,
          userAgent: requestContext?.userAgent,
          path: requestContext?.path,
        });

        return { isValid: true, apiKey };
      }

      // Verificar permisos en la relación
      if (
        !this.hasRequiredPermission(
          apiKeyInstallation.permission,
          requiredPermission,
        )
      ) {
        await this.apiKeyLogRepository.logEvent({
          apiKeyUuid: apiKey.uuid,
          installationUuid,
          eventType: ApiKeyEventType.PERMISSION_DENIED,
          description: `API key has ${apiKeyInstallation.permission} permission but ${requiredPermission} is required`,
          ipAddress: requestContext?.ipAddress,
          userAgent: requestContext?.userAgent,
          path: requestContext?.path,
        });
        return { isValid: false };
      }

      // Verificar rate limiting a nivel de API Key
      if (await this.isRateLimited(apiKey, requestContext)) {
        return { isValid: false };
      }

      // Verificar rate limiting a nivel de API Key + Installation
      if (
        await this.isRateLimitedForInstallation(
          apiKeyInstallation,
          requestContext,
        )
      ) {
        return { isValid: false };
      }

      // Actualizar fecha de último uso y contador
      await this.apiKeyInstallationRepository.updateRequestCount(
        apiKeyInstallation.uuid,
      );
      await this.apiKeyRepository.updateLastUsed(apiKey.uuid);
      await this.apiKeyRepository.incrementRequestCount(apiKey.uuid);

      // Registrar evento de validación exitosa
      await this.apiKeyLogRepository.logEvent({
        apiKeyUuid: apiKey.uuid,
        installationUuid,
        eventType: ApiKeyEventType.VALIDATED,
        description: "API key validated successfully",
        ipAddress: requestContext?.ipAddress,
        userAgent: requestContext?.userAgent,
        path: requestContext?.path,
      });

      return { isValid: true, apiKey, installation: apiKeyInstallation };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      this.logger.error(`Error validating API key: ${errorMessage}`);
      await this.logFailedValidation(
        undefined,
        installationUuid,
        `Error validating API key: ${errorMessage}`,
        requestContext,
      );
      return { isValid: false };
    }
  }

  /**
   * Verifica si una API Key ha excedido su límite de tasa
   */
  private async isRateLimited(
    apiKey: ApiKeyEntity,
    requestContext?: RequestContext,
  ): Promise<boolean> {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const requestCount =
      await this.apiKeyLogRepository.countByApiKeyAndEventType(
        apiKey.uuid,
        ApiKeyEventType.VALIDATED,
        { start: oneMinuteAgo, end: new Date() },
      );

    if (requestCount >= apiKey.rateLimit) {
      await this.apiKeyLogRepository.logEvent({
        apiKeyUuid: apiKey.uuid,
        eventType: ApiKeyEventType.RATE_LIMITED,
        description: `Rate limit exceeded: ${requestCount}/${apiKey.rateLimit} requests per minute`,
        ipAddress: requestContext?.ipAddress,
        userAgent: requestContext?.userAgent,
        path: requestContext?.path,
      });
      return true;
    }

    return false;
  }

  /**
   * Verifica si una relación API Key + Installation ha excedido su límite de tasa
   */
  private async isRateLimitedForInstallation(
    apiKeyInstallation: ApiKeyInstallationEntity,
    requestContext?: RequestContext,
  ): Promise<boolean> {
    // Si el requestCount actual es mayor que el rate limit, se ha excedido
    if (apiKeyInstallation.requestCount >= apiKeyInstallation.rateLimit) {
      // Verificar si ha pasado al menos un minuto desde el último uso
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

      if (
        apiKeyInstallation.lastUsedAt &&
        apiKeyInstallation.lastUsedAt > oneMinuteAgo
      ) {
        // No ha pasado un minuto, está rate limited
        await this.apiKeyLogRepository.logEvent({
          apiKeyUuid: apiKeyInstallation.apiKeyUuid,
          installationUuid: apiKeyInstallation.installationUuid,
          eventType: ApiKeyEventType.RATE_LIMITED,
          description: `Installation rate limit exceeded: ${apiKeyInstallation.requestCount}/${apiKeyInstallation.rateLimit} requests per minute`,
          ipAddress: requestContext?.ipAddress,
          userAgent: requestContext?.userAgent,
          path: requestContext?.path,
        });
        return true;
      } else {
        // Ha pasado más de un minuto, resetear contador
        await this.apiKeyInstallationRepository.resetRequestCount(
          apiKeyInstallation.uuid,
        );
      }
    }

    return false;
  }

  /**
   * Determina si un permiso concedido cumple con el requerido
   */
  private hasRequiredPermission(
    grantedPermission: ApiKeyPermission,
    requiredPermission: ApiKeyPermission,
  ): boolean {
    const permissionHierarchy = {
      [ApiKeyPermission.READ]: 1,
      [ApiKeyPermission.WRITE]: 2,
      [ApiKeyPermission.ADMIN]: 3,
    };

    return (
      permissionHierarchy[grantedPermission] >=
      permissionHierarchy[requiredPermission]
    );
  }

  /**
   * Registra un intento fallido de validación de API Key
   */
  private async logFailedValidation(
    apiKeyUuid?: string,
    installationUuid?: string,
    reason?: string,
    requestContext?: RequestContext,
  ): Promise<void> {
    try {
      await this.apiKeyLogRepository.logEvent({
        apiKeyUuid: apiKeyUuid ?? "unknown",
        installationUuid,
        eventType: ApiKeyEventType.FAILED_VALIDATION,
        description: reason ?? "Unknown validation failure",
        ipAddress: requestContext?.ipAddress,
        userAgent: requestContext?.userAgent,
        path: requestContext?.path,
      });
    } catch (error) {
      this.logger.error(
        `Failed to log API key validation failure: ${String(error)}`,
      );
    }
  }

  /**
   * Obtiene una API Key por su UUID
   */
  async getApiKey(uuid: string): Promise<ApiKeyEntity> {
    const apiKey = await this.apiKeyRepository.findByUuid(uuid);
    if (!apiKey) {
      throw new NotFoundException(`API Key with UUID ${uuid} not found`);
    }
    return apiKey;
  }

  /**
   * Obtiene todas las API Keys de una instalación
   */
  async getApiKeysByInstallation(
    installationUuid: string,
  ): Promise<ApiKeyEntity[]> {
    return this.apiKeyRepository.findByInstallation(installationUuid);
  }

  /**
   * Añade una instalación a una API Key con los permisos especificados
   */
  async addInstallationToApiKey(
    apiKeyUuid: string,
    installationUuid: string,
    permission: ApiKeyPermission = ApiKeyPermission.READ,
    rateLimit?: number,
    requestContext?: RequestContext,
  ): Promise<ApiKeyInstallationEntity> {
    // Verificar que ambos existan
    const apiKey = await this.apiKeyRepository.findByUuid(apiKeyUuid);
    if (!apiKey) {
      throw new NotFoundException(`API Key with UUID ${apiKeyUuid} not found`);
    }

    const installation =
      await this.installationRepository.findByUuid(installationUuid);
    if (!installation) {
      throw new NotFoundException(
        `Installation with UUID ${installationUuid} not found`,
      );
    }

    // Verificar si ya existe la relación
    const existingRelation =
      await this.apiKeyInstallationRepository.findByApiKeyAndInstallation(
        apiKeyUuid,
        installationUuid,
      );

    if (existingRelation) {
      throw new BadRequestException(
        `API Key ${apiKeyUuid} already has access to installation ${installationUuid}`,
      );
    }

    // Crear la relación
    const apiKeyInstallation = await this.apiKeyInstallationRepository.create({
      apiKeyUuid,
      installationUuid,
      permission,
      rateLimit: rateLimit ?? 100, // Default: 100 RPM
    });

    // Registrar el evento
    await this.apiKeyLogRepository.logEvent({
      apiKeyUuid,
      installationUuid,
      eventType: ApiKeyEventType.CREATED,
      description: `Installation ${installationUuid} added to API Key with ${permission} permission`,
      ipAddress: requestContext?.ipAddress,
      userAgent: requestContext?.userAgent,
      path: requestContext?.path,
    });

    return apiKeyInstallation;
  }

  /**
   * Actualiza los permisos de una API Key para una instalación
   */
  async updateApiKeyInstallationPermission(
    apiKeyUuid: string,
    installationUuid: string,
    permission: ApiKeyPermission,
    requestContext?: RequestContext,
  ): Promise<ApiKeyInstallationEntity> {
    const relation =
      await this.apiKeyInstallationRepository.findByApiKeyAndInstallation(
        apiKeyUuid,
        installationUuid,
      );

    if (!relation) {
      throw new NotFoundException(
        `No relationship found between API Key ${apiKeyUuid} and Installation ${installationUuid}`,
      );
    }

    await this.apiKeyInstallationRepository.updatePermission(
      relation.uuid,
      permission,
    );

    // Registrar el evento
    await this.apiKeyLogRepository.logEvent({
      apiKeyUuid,
      installationUuid,
      eventType: ApiKeyEventType.CREATED,
      description: `Permission updated to ${permission} for installation ${installationUuid}`,
      ipAddress: requestContext?.ipAddress,
      userAgent: requestContext?.userAgent,
      path: requestContext?.path,
    });

    // Obtener la relación actualizada
    return this.apiKeyInstallationRepository.findById(
      relation.uuid,
    ) as Promise<ApiKeyInstallationEntity>;
  }

  /**
   * Elimina el acceso de una API Key a una instalación
   */
  async removeInstallationFromApiKey(
    apiKeyUuid: string,
    installationUuid: string,
    requestContext?: RequestContext,
  ): Promise<void> {
    const relation =
      await this.apiKeyInstallationRepository.findByApiKeyAndInstallation(
        apiKeyUuid,
        installationUuid,
      );

    if (!relation) {
      throw new NotFoundException(
        `No relationship found between API Key ${apiKeyUuid} and Installation ${installationUuid}`,
      );
    }

    await this.apiKeyInstallationRepository.delete(relation.uuid);

    // Registrar el evento
    await this.apiKeyLogRepository.logEvent({
      apiKeyUuid,
      installationUuid,
      eventType: ApiKeyEventType.REVOKED,
      description: `Access to installation ${installationUuid} removed from API Key`,
      ipAddress: requestContext?.ipAddress,
      userAgent: requestContext?.userAgent,
      path: requestContext?.path,
    });
  }

  /**
   * Revoca una API Key
   */
  async revokeApiKey(
    uuid: string,
    requestContext?: RequestContext,
  ): Promise<ApiKeyEntity> {
    const apiKey = await this.apiKeyRepository.findByUuid(uuid);
    if (!apiKey) {
      throw new NotFoundException(`API Key with UUID ${uuid} not found`);
    }

    const revokedKey = await this.apiKeyRepository.revokeKey(uuid);
    if (!revokedKey) {
      throw new Error(`Failed to revoke API Key with UUID ${uuid}`);
    }

    // Registrar el evento
    await this.apiKeyLogRepository.logEvent({
      apiKeyUuid: uuid,
      eventType: ApiKeyEventType.REVOKED,
      description: "API key was revoked",
      ipAddress: requestContext?.ipAddress,
      userAgent: requestContext?.userAgent,
      path: requestContext?.path,
    });

    return revokedKey;
  }

  /**
   * Elimina una API Key
   */
  async deleteApiKey(
    uuid: string,
    requestContext?: RequestContext,
  ): Promise<void> {
    const apiKey = await this.apiKeyRepository.findByUuid(uuid);
    if (!apiKey) {
      throw new NotFoundException(`API Key with UUID ${uuid} not found`);
    }

    // Registrar el evento antes de eliminar
    await this.apiKeyLogRepository.logEvent({
      apiKeyUuid: uuid,
      eventType: ApiKeyEventType.REVOKED,
      description: "API key was deleted",
      ipAddress: requestContext?.ipAddress,
      userAgent: requestContext?.userAgent,
      path: requestContext?.path,
    });

    await this.apiKeyRepository.deleteKey(uuid);
  }

  /**
   * Marca como expiradas las API Keys que han sobrepasado su fecha de expiración
   */
  async cleanupExpiredKeys(): Promise<number> {
    const count = await this.apiKeyRepository.markExpiredKeys();
    if (count > 0) {
      this.logger.log(`Marked ${count} API keys as expired`);
    }
    return count;
  }

  /**
   * Regenera una API Key (revoca la anterior y crea una nueva)
   */
  async regenerateApiKey(
    uuid: string,
    requestContext?: RequestContext,
  ): Promise<{ apiKey: ApiKeyEntity; secretKey: string }> {
    const apiKey = await this.apiKeyRepository.findByUuid(uuid);
    if (!apiKey) {
      throw new NotFoundException(`API Key with UUID ${uuid} not found`);
    }

    // Revocar la clave actual
    await this.apiKeyRepository.revokeKey(uuid);

    // Registrar el evento de revocación
    await this.apiKeyLogRepository.logEvent({
      apiKeyUuid: uuid,
      eventType: ApiKeyEventType.REVOKED,
      description: "API key was revoked for regeneration",
      ipAddress: requestContext?.ipAddress,
      userAgent: requestContext?.userAgent,
      path: requestContext?.path,
    });

    // Crear una nueva clave con los mismos datos
    return this.createApiKey({
      name: apiKey.name,
      description: apiKey.description,
      installationUuid: apiKey.installationUuid,
      expiresAt: apiKey.expiresAt,
      createdBy: apiKey.createdBy,
      metadata: apiKey.metadata,
      rateLimit: apiKey.rateLimit,
      requestContext,
    });
  }

  /**
   * Obtiene todos los logs de una API Key
   */
  async getApiKeyLogs(
    apiKeyUuid: string,
    limit = 50,
    offset = 0,
  ): Promise<ApiKeyLogEntity[]> {
    return this.apiKeyLogRepository.findByApiKey(apiKeyUuid, limit, offset);
  }

  /**
   * Obtiene todos los logs de una instalación
   */
  async getInstallationLogs(
    installationUuid: string,
    limit = 50,
    offset = 0,
  ): Promise<ApiKeyLogEntity[]> {
    return this.apiKeyLogRepository.findByInstallation(
      installationUuid,
      limit,
      offset,
    );
  }
}
