import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ApiKeyEntity } from "../../data/api-keys/api-key.entity";
import { ApiKeyInstallationEntity } from "../../data/api-keys/api-key-installation.entity";
import { ApiKeyLogEntity } from "../../data/api-keys/api-key-log.entity";
import { ApiKeysDataModule } from "../../data/api-keys/api-keys-data.module";
import { InstallationEntity } from "../../data/installations/installation.entity";
import { InstallationsDataModule } from "../../data/installations/installations-data.module";
import { ApiKeyService } from "./api-key.service";

const repositories = TypeOrmModule.forFeature([
  ApiKeyEntity,
  ApiKeyLogEntity,
  InstallationEntity,
  ApiKeyInstallationEntity,
]);

@Module({
  imports: [ApiKeysDataModule, InstallationsDataModule, repositories],
  providers: [ApiKeyService],
  exports: [ApiKeyService],
})
export class ApiKeysCoreModule {}
