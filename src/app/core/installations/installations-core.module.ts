import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { InstallationsDataModule } from "../../data/installations/installations-data.module";
import { InstallationService } from "./installation.service";

@Module({
  imports: [CqrsModule, InstallationsDataModule],
  providers: [InstallationService],
  exports: [InstallationService],
})
export class InstallationsCoreModule {}
