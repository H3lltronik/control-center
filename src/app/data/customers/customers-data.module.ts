import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CustomerEntity } from "./customer.entity";
import { CustomerRepository } from "./customer.repository";

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  providers: [CustomerRepository],
  exports: [CustomerRepository],
})
export class CustomersDataModule {}
