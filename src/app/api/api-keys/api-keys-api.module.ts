import { Module } from "@nestjs/common";

import { ApiKeysCoreModule } from "../../core/api-keys/api-keys-core.module";
import { ApiKeysController } from "./api-keys.controller";

@Module({
  imports: [ApiKeysCoreModule],
  controllers: [ApiKeysController],
})
export class ApiKeysApiModule {}
