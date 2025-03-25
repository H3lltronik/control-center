import { Module } from "@nestjs/common";

import { ApiKeysDataModule } from "../../data/api-keys/api-keys-data.module";
import { InstallationsDataModule } from "../../data/installations/installations-data.module";
import { ApiKeyService } from "./api-key.service";

@Module({
  imports: [ApiKeysDataModule, InstallationsDataModule],
  providers: [ApiKeyService],
  exports: [ApiKeyService],
})
export class ApiKeysCoreModule {}
