import { Body, Controller, Post } from "@nestjs/common";

import { CustomerService } from "../../core/customers/customer.service";
import { CustomerEntity } from "../../data/customers/customer.entity";
import { CreateCustomerDto } from "./dtos/create-customer.dto";

@Controller("customers")
export class CustomersController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerEntity> {
    return this.customerService.create(createCustomerDto);
  }
}
