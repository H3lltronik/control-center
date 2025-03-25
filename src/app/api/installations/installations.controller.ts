import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { InstallationService } from "../../core/installations/installation.service";
import { InstallationEntity } from "../../data/installations/installation.entity";
import { CreateInstallationDto } from "./dtos/create-installation.dto";

@Controller("installations")
export class InstallationsController {
  constructor(private readonly installationService: InstallationService) {}

  @Post()
  create(
    @Body() createInstallationDto: CreateInstallationDto,
  ): Promise<InstallationEntity> {
    return this.installationService.create(createInstallationDto);
  }

  @Get(":uuid")
  findByUuid(@Param("uuid") uuid: string): Promise<InstallationEntity | null> {
    return this.installationService.findByUuid(uuid);
  }
}
