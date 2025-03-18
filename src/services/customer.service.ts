import { Injectable } from "@nestjs/common";

import { CreateCustomerDto } from "../dtos/create-customer.dto";
import { Customer } from "../entities/customer.entity";
import { CustomerRepository } from "../repositories/customer.repository";

@Injectable()
export class CustomerService {
  constructor(private customerRepository: CustomerRepository) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Check if customer with email already exists
    const existingCustomer = await this.customerRepository.findOneByEmail(
      createCustomerDto.email,
    );

    if (existingCustomer) {
      throw new Error(
        `Customer with email ${createCustomerDto.email} already exists`,
      );
    }

    return this.customerRepository.create(createCustomerDto);
  }

  async findOneById(id: string): Promise<Customer | null> {
    return this.customerRepository.findOneById(id);
  }
}
