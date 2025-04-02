import { ICommand } from "@nestjs/cqrs";

export class CreateInstallationCommand implements ICommand {
  constructor(
    public readonly productName: string,
    public readonly customerId: string,
  ) {}
}
