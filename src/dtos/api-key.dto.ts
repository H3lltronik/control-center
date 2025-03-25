import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";

export class CreateApiKeyDto {
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsArray()
  @IsString({ each: true })
  allowedSystems!: string[];

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class UpdateApiKeyDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedSystems?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class ApiKeyResponseDto {
  @IsUUID()
  uuid!: string;

  @IsString()
  name!: string;

  @IsString()
  key!: string;

  @IsArray()
  @IsString({ each: true })
  allowedSystems!: string[];

  @IsBoolean()
  isActive!: boolean;

  @IsOptional()
  @IsDateString()
  lastUsedAt?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsDateString()
  createdAt!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class VerifyApiKeyDto {
  @IsString()
  key!: string;

  @IsString()
  system!: string;
}

export class ApiKeyVerificationResponseDto {
  @IsBoolean()
  isValid!: boolean;

  @IsOptional()
  @IsUUID()
  uuid?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
