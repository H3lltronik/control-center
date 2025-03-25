import { ConflictException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { CustomerEntity } from "../../customer.entity";
import { CustomerRepository } from "../../customer.repository";
import { CreateCustomerCommand } from "./create-customer.command";

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler
  implements ICommandHandler<CreateCustomerCommand>
{
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(command: CreateCustomerCommand): Promise<CustomerEntity> {
    const { email, name, phone } = command;

    const existingCustomer = await this.customerRepository.findByEmail(email);
    if (existingCustomer) {
      throw new ConflictException("Customer with this email already exists");
    }

    return this.customerRepository.create({ email, name, phone });
  }
}
