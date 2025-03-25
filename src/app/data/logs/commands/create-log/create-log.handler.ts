import { NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { CreateLogDto } from "../../../../api/logs/dtos/create-log.dto";
import { InstallationEntity } from "../../../installations/installation.entity";
import { InstallationRepository } from "../../../installations/installation.repository";
import { LogEntity } from "../../log.entity";
import { LogRepository } from "../../log.repository";
import { CreateLogCommand } from "./create-log.command";

@CommandHandler(CreateLogCommand)
export class CreateLogHandler implements ICommandHandler<CreateLogCommand> {
  constructor(
    private readonly logRepository: LogRepository,
    private readonly installationRepository: InstallationRepository,
  ) {}

  async execute(command: CreateLogCommand): Promise<LogEntity> {
    const { data } = command;
    const { installationId, ...logData } = data;
    const createData: CreateLogDto & { installation?: InstallationEntity } =
      logData;

    if (installationId) {
      const installation =
        await this.installationRepository.findByUuid(installationId);

      if (!installation) {
        throw new NotFoundException(
          `Installation with UUID ${installationId} not found`,
        );
      }

      createData.installation = installation;
    }

    return this.logRepository.create(createData);
  }
}
