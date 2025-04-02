import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { CreateCustomerHandler } from "../../data/customers/commands/create-customer/create-customer.handler";
import { CustomersDataModule } from "../../data/customers/customers-data.module";
import { GetCustomerByEmailHandler } from "../../data/customers/queries/get-customer/get-customer.handler";
import { CustomerService } from "./customer.service";

@Module({
  imports: [CqrsModule, CustomersDataModule],
  providers: [
    CustomerService,
    CreateCustomerHandler,
    GetCustomerByEmailHandler,
  ],
  exports: [CustomerService],
})
export class CustomersCoreModule {}
