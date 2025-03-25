import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CustomerService } from "../../core/customers/customer.service";
import { CreateCustomerHandler } from "../../data/customers/commands/create-customer/create-customer.handler";
import { CustomerEntity } from "../../data/customers/customer.entity";
import { CustomerRepository } from "../../data/customers/customer.repository";
import { GetCustomerByEmailHandler } from "../../data/customers/queries/get-customer/get-customer.handler";
import { CustomersController } from "./customers.controller";

const CommandHandlers = [CreateCustomerHandler];
const QueryHandlers = [GetCustomerByEmailHandler];

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity]), CqrsModule],
  providers: [
    CustomerRepository,
    CustomerService,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  controllers: [CustomersController],
  exports: [CustomerService, CustomerRepository],
})
export class CustomersModule {}
