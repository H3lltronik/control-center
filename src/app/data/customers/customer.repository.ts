import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateCustomerDto } from "../../api/customers/dtos/create-customer.dto";
import { CustomerEntity } from "./customer.entity";

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
    const customer = this.repository.create(createCustomerDto);
    return this.repository.save(customer);
  }

  async findByEmail(email: string): Promise<CustomerEntity | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    return this.repository.findOne({ where: { id } });
  }
}
