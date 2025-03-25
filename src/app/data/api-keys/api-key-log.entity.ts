import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";

import { TimestampsEntity } from "../common/timestamps.entity";
import { InstallationEntity } from "../installations/installation.entity";
import { ApiKeyEntity } from "./api-key.entity";

/**
 * Tipos de eventos que se pueden registrar en los logs de API Keys
 */
export enum ApiKeyEventType {
  CREATED = "CREATED",
  VALIDATED = "VALIDATED",
  FAILED_VALIDATION = "FAILED_VALIDATION",
  REVOKED = "REVOKED",
  EXPIRED = "EXPIRED",
  RATE_LIMITED = "RATE_LIMITED",
  ACCESS_DENIED = "ACCESS_DENIED",
  PERMISSION_DENIED = "PERMISSION_DENIED",
}

/**
 * Entidad para almacenar logs detallados de las API Keys
 */
@Entity("api_key_log")
export class ApiKeyLogEntity extends TimestampsEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid!: string;

  @Column({ type: "uuid" })
  apiKeyUuid!: string;

  @ManyToOne(() => ApiKeyEntity, apiKey => apiKey.logs)
  @JoinColumn({ name: "api_key_uuid" })
  apiKey!: Relation<ApiKeyEntity>;

  @Column({ type: "uuid", nullable: true })
  installationUuid?: string;

  @ManyToOne(() => InstallationEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "installation_uuid" })
  installation?: Relation<InstallationEntity>;

  /**
   * Tipo de evento
   */
  @Column({
    type: "enum",
    enum: ApiKeyEventType,
  })
  eventType!: ApiKeyEventType;

  /**
   * Descripción detallada del evento
   */
  @Column({ type: "text", nullable: true })
  description?: string;

  /**
   * IP desde donde se originó la petición
   */
  @Column({ type: "varchar", length: 45, nullable: true })
  ipAddress?: string;

  /**
   * User agent desde donde se originó la petición
   */
  @Column({ type: "varchar", length: 255, nullable: true })
  userAgent?: string;

  /**
   * Path o endpoint al que se intentó acceder
   */
  @Column({ type: "varchar", length: 255, nullable: true })
  path?: string;

  /**
   * Estado HTTP de la respuesta
   */
  @Column({ type: "int", nullable: true })
  statusCode?: number;

  /**
   * Metadatos adicionales en formato JSON
   */
  @Column({ type: "jsonb", default: {} })
  metadata!: Record<string, unknown>;
}
