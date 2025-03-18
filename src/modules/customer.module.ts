import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CustomerController } from "../controllers/customer.controller";
import { Customer } from "../entities/customer.entity";
import { CustomerRepository } from "../repositories/customer.repository";
import { CustomerService } from "../services/customer.service";

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  providers: [CustomerRepository, CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService, CustomerRepository],
})
export class CustomerModule {}
