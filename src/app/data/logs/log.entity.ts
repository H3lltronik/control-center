import {
  Column,
  Entity,
  Generated,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";

import { TimestampsEntity } from "../common/timestamps.entity";
import { InstallationEntity } from "../installations/installation.entity";

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export enum LogSource {
  FRONTEND = "frontend",
  BACKEND = "backend",
}

@Entity("logs")
@Index(["level", "source"])
@Index(["userId", "path"])
export class LogEntity extends TimestampsEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  @Generated("uuid")
  uuid!: string;

  @ManyToOne(() => InstallationEntity)
  @Index()
  installation!: Relation<InstallationEntity>;

  @Column({
    type: "enum",
    enum: LogLevel,
    default: LogLevel.INFO,
  })
  @Index()
  level!: LogLevel;

  @Column({
    type: "enum",
    enum: LogSource,
    default: LogSource.FRONTEND,
  })
  @Index()
  source!: LogSource;

  @Column({ type: "varchar", nullable: true })
  @Index()
  userId?: string;

  @Column({ type: "varchar", nullable: true })
  @Index()
  path?: string;

  @Column({ type: "jsonb" })
  content!: Record<string, unknown>;

  @Column({ type: "jsonb", nullable: true })
  metadata?: Record<string, unknown>;

  @Column({ type: "varchar", nullable: true })
  userAgent?: string;

  @Column({ type: "varchar", nullable: true })
  ipAddress?: string;

  @Column({ type: "text", nullable: true })
  stackTrace?: string;
}
