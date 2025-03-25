import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

import { LogLevel, LogSource } from "../../../data/logs/log.entity";

export class CreateLogDto {
  @IsUUID()
  @IsOptional()
  installationId?: string;

  @IsEnum(LogLevel)
  @IsNotEmpty()
  level!: LogLevel;

  @IsEnum(LogSource)
  @IsNotEmpty()
  source!: LogSource;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  path?: string;

  @IsObject()
  @IsNotEmpty()
  content!: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;

  @IsString()
  @IsOptional()
  userAgent?: string;

  @IsString()
  @IsOptional()
  ipAddress?: string;

  @IsString()
  @IsOptional()
  stackTrace?: string;
}
