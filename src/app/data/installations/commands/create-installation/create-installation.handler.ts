import { NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { CustomerRepository } from "../../../customers/customer.repository";
import { InstallationEntity } from "../../installation.entity";
import { InstallationRepository } from "../../installation.repository";
import { CreateInstallationCommand } from "./create-installation.command";

@CommandHandler(CreateInstallationCommand)
export class CreateInstallationHandler
  implements ICommandHandler<CreateInstallationCommand>
{
  constructor(
    private readonly installationRepository: InstallationRepository,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(
    command: CreateInstallationCommand,
  ): Promise<InstallationEntity> {
    const { productName, customerId } = command;

    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    return this.installationRepository.create({ productName, customer });
  }
}
