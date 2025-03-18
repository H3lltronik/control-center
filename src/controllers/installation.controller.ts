import { Body, Controller, Post } from "@nestjs/common";

import { CreateInstallationDto } from "../dtos/create-installation.dto";
import { Installation } from "../entities/installation.entity";
import { InstallationService } from "../services/installation.service";

@Controller("installations")
export class InstallationController {
  constructor(private readonly installationService: InstallationService) {}

  @Post()
  create(
    @Body() createInstallationDto: CreateInstallationDto,
  ): Promise<Installation> {
    return this.installationService.create(createInstallationDto);
  }
}
