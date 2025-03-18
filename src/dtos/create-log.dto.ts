import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

import { LogLevel, LogSource } from "../entities/log.entity";

export class CreateLogDto {
  @IsNotEmpty()
  @IsUUID()
  installationId!: string;

  @IsEnum(LogLevel)
  @IsOptional()
  level?: LogLevel;

  @IsEnum(LogSource)
  @IsOptional()
  source?: LogSource;

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
