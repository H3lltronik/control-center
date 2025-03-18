import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { InstallationController } from "../controllers/installation.controller";
import { Installation } from "../entities/installation.entity";
import { InstallationRepository } from "../repositories/installation.repository";
import { InstallationService } from "../services/installation.service";
import { CustomerModule } from "./customer.module";

@Module({
  imports: [TypeOrmModule.forFeature([Installation]), CustomerModule],
  providers: [InstallationRepository, InstallationService],
  controllers: [InstallationController],
  exports: [InstallationService],
})
export class InstallationModule {}
