import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { InstallationEntity } from "./installation.entity";
import { InstallationRepository } from "./installation.repository";

@Module({
  imports: [TypeOrmModule.forFeature([InstallationEntity])],
  providers: [InstallationRepository],
  exports: [InstallationRepository],
})
export class InstallationsDataModule {}
