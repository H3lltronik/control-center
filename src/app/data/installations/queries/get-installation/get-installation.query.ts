import { IQuery } from "@nestjs/cqrs";

export class GetInstallationByUuidQuery implements IQuery {
  constructor(public readonly uuid: string) {}
}
