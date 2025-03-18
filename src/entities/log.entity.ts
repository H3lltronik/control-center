import {
  Column,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

import { TimestampsEntity } from "../common/timestamps-entity";

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
export class Log extends TimestampsEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  @Generated("uuid")
  uuid!: string;

  @Column()
  @Index()
  installationId!: string;

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

  @Column({ nullable: true })
  @Index()
  userId?: string;

  @Column({ nullable: true })
  @Index()
  path?: string;

  @Column({ type: "jsonb" })
  content!: Record<string, unknown>;

  @Column({ type: "jsonb", nullable: true })
  metadata?: Record<string, unknown>;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ type: "text", nullable: true })
  stackTrace?: string;
}
