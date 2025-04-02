import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CustomerEntity } from "../customers/customer.entity";
import { CustomerRepository } from "../customers/customer.repository";
import { CreateInstallationHandler } from "./commands/create-installation/create-installation.handler";
import { InstallationEntity } from "./installation.entity";
import { InstallationRepository } from "./installation.repository";

@Module({
  imports: [TypeOrmModule.forFeature([InstallationEntity, CustomerEntity])],
  providers: [
    InstallationRepository,
    CustomerRepository,
    CreateInstallationHandler,
  ],
  exports: [InstallationRepository],
})
export class InstallationsDataModule {}
