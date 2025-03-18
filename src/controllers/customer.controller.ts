import { Body, Controller, Post } from "@nestjs/common";

import { CreateCustomerDto } from "../dtos/create-customer.dto";
import { Customer } from "../entities/customer.entity";
import { CustomerService } from "../services/customer.service";

@Controller("customers")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customerService.create(createCustomerDto);
  }
}
