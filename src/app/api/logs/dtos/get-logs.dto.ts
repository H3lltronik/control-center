import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

import { LogLevel, LogSource } from "../../../data/logs/log.entity";

export class GetLogsDto {
  @IsUUID()
  @IsOptional()
  installationId?: string;

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

  @Transform(({ value }: { value: string }) => {
    return value ? new Date(value) : undefined;
  })
  @IsOptional()
  startDate?: Date;

  @Transform(({ value }: { value: string }) => {
    return value ? new Date(value) : undefined;
  })
  @IsOptional()
  endDate?: Date;
}
