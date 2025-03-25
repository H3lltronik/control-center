import { Module } from "@nestjs/common";

import { InstallationsCoreModule } from "../../core/installations/installations-core.module";
import { InstallationsController } from "./installations.controller";

@Module({
  imports: [InstallationsCoreModule],
  controllers: [InstallationsController],
})
export class InstallationsApiModule {}
