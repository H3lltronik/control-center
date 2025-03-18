import { Injectable } from "@nestjs/common";

import { CreateInstallationDto } from "../dtos/create-installation.dto";
import { Installation } from "../entities/installation.entity";
import { InstallationRepository } from "../repositories/installation.repository";

@Injectable()
export class InstallationService {
  constructor(private installationRepository: InstallationRepository) {}

  async create(
    createInstallationDto: CreateInstallationDto,
  ): Promise<Installation> {
    return this.installationRepository.create(createInstallationDto);
  }

  async findOneById(id: string): Promise<Installation | null> {
    return this.installationRepository.findOneById(id);
  }
}
