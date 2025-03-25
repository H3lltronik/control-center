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
 * Tipos de permisos que pueden tener una API Key sobre una instalación
 */
export enum ApiKeyPermission {
  READ = "READ",
  WRITE = "WRITE",
  ADMIN = "ADMIN",
}

/**
 * Entidad que relaciona API Keys con instalaciones, permitiendo permisos granulares
 */
@Entity("api_key_installation")
export class ApiKeyInstallationEntity extends TimestampsEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid!: string;

  @Column({ type: "uuid" })
  apiKeyUuid!: string;

  @ManyToOne(() => ApiKeyEntity, apiKey => apiKey.apiKeyInstallations)
  @JoinColumn({ name: "api_key_uuid" })
  apiKey!: Relation<ApiKeyEntity>;

  @Column({ type: "uuid" })
  installationUuid!: string;

  @ManyToOne(() => InstallationEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "installation_uuid" })
  installation!: Relation<InstallationEntity>;

  /**
   * Permisos que tiene la API Key sobre la instalación
   */
  @Column({
    type: "enum",
    enum: ApiKeyPermission,
    default: ApiKeyPermission.READ,
  })
  permission!: ApiKeyPermission;

  /**
   * Límite de peticiones por minuto
   */
  @Column({ type: "int", default: 100 })
  rateLimit!: number;

  /**
   * Contador de peticiones (útil para rate limiting)
   */
  @Column({ type: "int", default: 0 })
  requestCount!: number;

  /**
   * Fecha de la última petición
   */
  @Column({ type: "timestamp", nullable: true })
  lastUsedAt?: Date;
}
