import { Injectable, NotFoundException } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { CreateInstallationDto } from "../../api/installations/dtos/create-installation.dto";
import { CreateInstallationCommand } from "../../data/installations/commands/create-installation/create-installation.command";
import { InstallationEntity } from "../../data/installations/installation.entity";
import { GetInstallationByUuidQuery } from "../../data/installations/queries/get-installation/get-installation.query";

@Injectable()
export class InstallationService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(
    createInstallationDto: CreateInstallationDto,
  ): Promise<InstallationEntity> {
    const { productName, customerId } = createInstallationDto;
    return await this.commandBus.execute<
      CreateInstallationCommand,
      InstallationEntity
    >(new CreateInstallationCommand(productName, customerId));
  }

  async findByUuid(uuid: string): Promise<InstallationEntity | null> {
    const installation = await this.queryBus.execute<
      GetInstallationByUuidQuery,
      InstallationEntity | null
    >(new GetInstallationByUuidQuery(uuid));

    if (!installation) {
      throw new NotFoundException(`Installation with UUID ${uuid} not found`);
    }

    return installation;
  }
}
