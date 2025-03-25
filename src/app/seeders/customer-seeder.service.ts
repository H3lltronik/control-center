import { faker } from "@faker-js/faker";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CustomerEntity } from "../data/customers/customer.entity";

@Injectable()
export class CustomerSeederService {
  private readonly logger = new Logger(CustomerSeederService.name);
  private readonly numCustomers = 10; // Número de clientes a crear

  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async seed(): Promise<void> {
    this.logger.log(`Creating ${this.numCustomers} customers`);

    const customers: CustomerEntity[] = [];

    for (let i = 0; i < this.numCustomers; i++) {
      const customer = this.customerRepository.create({
        name: faker.company.name(),
        email: faker.internet.email({ provider: "example.com" }),
        phone: faker.phone.number(),
      });

      customers.push(customer);
    }

    await this.customerRepository.save(customers);
    this.logger.log(`Created ${customers.length} customers successfully`);
  }

  async clean(): Promise<void> {
    this.logger.log("Cleaning customers");
    await this.customerRepository.delete({});
    this.logger.log("Customers cleaned successfully");
  }
}
