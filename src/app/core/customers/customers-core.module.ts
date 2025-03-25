import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { CustomersDataModule } from "../../data/customers/customers-data.module";
import { CustomerService } from "./customer.service";

@Module({
  imports: [CqrsModule, CustomersDataModule],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomersCoreModule {}
