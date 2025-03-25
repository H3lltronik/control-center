import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { InstallationEntity } from "../../installation.entity";
import { InstallationRepository } from "../../installation.repository";
import { GetInstallationByUuidQuery } from "./get-installation.query";

@QueryHandler(GetInstallationByUuidQuery)
export class GetInstallationByUuidHandler
  implements IQueryHandler<GetInstallationByUuidQuery>
{
  constructor(
    private readonly installationRepository: InstallationRepository,
  ) {}

  async execute(
    query: GetInstallationByUuidQuery,
  ): Promise<InstallationEntity | null> {
    return this.installationRepository.findByUuid(query.uuid);
  }
}
