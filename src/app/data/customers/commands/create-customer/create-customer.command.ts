import { ICommand } from "@nestjs/cqrs";

export class CreateCustomerCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly phone: string,
  ) {}
}
