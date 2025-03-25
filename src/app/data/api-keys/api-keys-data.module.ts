import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ApiKeyEntity } from "./api-key.entity";
import { ApiKeyRepository } from "./api-key.repository";
import { ApiKeyInstallationEntity } from "./api-key-installation.entity";
import { ApiKeyInstallationRepository } from "./api-key-installation.repository";
import { ApiKeyLogEntity } from "./api-key-log.entity";
import { ApiKeyLogRepository } from "./api-key-log.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApiKeyEntity,
      ApiKeyInstallationEntity,
      ApiKeyLogEntity,
    ]),
  ],
  providers: [
    ApiKeyRepository,
    ApiKeyInstallationRepository,
    ApiKeyLogRepository,
  ],
  exports: [
    ApiKeyRepository,
    ApiKeyInstallationRepository,
    ApiKeyLogRepository,
  ],
})
export class ApiKeysDataModule {}
