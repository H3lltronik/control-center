import { Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";

import { TimestampsEntity } from "../common/timestamps-entity";

/**
 * API Key entity for external integrations
 */
@Entity("api_keys")
export class ApiKey extends TimestampsEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  @Generated("uuid")
  uuid!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  key!: string;

  @Column("text", { array: true, default: [] })
  allowedSystems!: string[];

  @Column("jsonb", { nullable: true })
  metadata?: Record<string, unknown>;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column({ type: "timestamp", nullable: true })
  lastUsedAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  expiresAt?: Date;
}
