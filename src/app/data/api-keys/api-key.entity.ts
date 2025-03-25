import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";

import { TimestampsEntity } from "../common/timestamps.entity";
import { InstallationEntity } from "../installations/installation.entity";
import { ApiKeyInstallationEntity } from "./api-key-installation.entity";
import { ApiKeyLogEntity } from "./api-key-log.entity";

export enum ApiKeyStatus {
  ACTIVE = "active",
  REVOKED = "revoked",
  EXPIRED = "expired",
}

@Entity("api_key")
export class ApiKeyEntity extends TimestampsEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  key!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({
    type: "enum",
    enum: ApiKeyStatus,
    default: ApiKeyStatus.ACTIVE,
  })
  status!: ApiKeyStatus;

  @Column({ type: "timestamp", nullable: true })
  expiresAt?: Date;

  @Column({ type: "uuid", name: "installation_uuid" })
  installationUuid!: string;

  @ManyToOne(() => InstallationEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "installation_uuid", referencedColumnName: "id" })
  installation?: Relation<InstallationEntity>;

  @OneToMany(
    () => ApiKeyInstallationEntity,
    apiKeyInstallation => apiKeyInstallation.apiKey,
  )
  apiKeyInstallations?: Relation<ApiKeyInstallationEntity[]>;

  @OneToMany(() => ApiKeyLogEntity, apiKeyLog => apiKeyLog.apiKey)
  logs?: Relation<ApiKeyLogEntity[]>;

  @Column({ type: "varchar", length: 50, nullable: true })
  createdBy?: string;

  @Column({ type: "jsonb", default: {} })
  metadata!: Record<string, unknown>;

  @Column({ type: "timestamp", nullable: true })
  lastUsedAt?: Date;

  @Column({ type: "int", default: 300 })
  rateLimit!: number;

  @Column({ type: "int", default: 0 })
  requestCount!: number;

  isValid(): boolean {
    return (
      this.status === ApiKeyStatus.ACTIVE &&
      (!this.expiresAt || new Date() < this.expiresAt)
    );
  }
}
