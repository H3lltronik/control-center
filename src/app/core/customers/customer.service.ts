import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { CreateCustomerDto } from "../../api/customers/dtos/create-customer.dto";
import { CreateCustomerCommand } from "../../data/customers/commands/create-customer/create-customer.command";
import { CustomerEntity } from "../../data/customers/customer.entity";
import { GetCustomerByEmailQuery } from "../../data/customers/queries/get-customer/get-customer.query";

@Injectable()
export class CustomerService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
    const { name, email, phone } = createCustomerDto;
    return await this.commandBus.execute<CreateCustomerCommand, CustomerEntity>(
      new CreateCustomerCommand(name, email, phone),
    );
  }

  async findByEmail(email: string): Promise<CustomerEntity | null> {
    return await this.queryBus.execute<
      GetCustomerByEmailQuery,
      CustomerEntity | null
    >(new GetCustomerByEmailQuery(email));
  }
}
