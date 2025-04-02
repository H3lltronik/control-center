import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CustomerService } from "../../app/core/customers/customer.service";
import { InstallationService } from "../../app/core/installations/installation.service";
import { CustomerEntity } from "../../app/data/customers/customer.entity";
import { InstallationEntity } from "../../app/data/installations/installation.entity";

@Injectable()
export class ToolingInstallationService {
  private readonly logger = new Logger(ToolingInstallationService.name);

  constructor(
    @Inject(CustomerService)
    private readonly customerService: CustomerService,
    @Inject(InstallationService)
    private readonly installationService: InstallationService,
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    @InjectRepository(InstallationEntity)
    private readonly installationRepository: Repository<InstallationEntity>,
  ) {}

  /**
   * Lists all installations
   */
  async listInstallations(): Promise<InstallationEntity[]> {
    return this.installationRepository.find({
      relations: ["customer"],
    });
  }

  /**
   * Lists all customers
   */
  async listCustomers(): Promise<CustomerEntity[]> {
    return this.customerRepository.find({
      relations: ["installations"],
    });
  }

  /**
   * Creates a new customer
   */
  async createCustomer(
    name: string,
    email: string,
    phone: string,
  ): Promise<CustomerEntity> {
    return this.customerService.create({
      name,
      email,
      phone,
    });
  }

  /**
   * Updates an existing customer
   */
  async updateCustomer(
    id: string,
    name: string,
    email: string,
    phone: string,
  ): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new Error(`Customer with ID ${id} not found`);
    }

    customer.name = name;
    customer.email = email;
    customer.phone = phone;

    return this.customerRepository.save(customer);
  }

  /**
   * Creates a new installation
   */
  async createInstallation(
    customerId: string,
    productName: string,
  ): Promise<InstallationEntity> {
    const installation = await this.installationService.create({
      productName,
      customerId,
    });

    // Reload the installation with customer relation
    const fullInstallation = await this.installationRepository.findOne({
      where: { id: installation.id },
      relations: ["customer"],
    });

    if (!fullInstallation) {
      throw new Error(`Failed to reload installation with ID ${installation.id}`);
    }

    return fullInstallation;
  }

  /**
   * Updates an existing installation
   */
  async updateInstallation(
    id: string,
    customerId: string,
    productName: string,
  ): Promise<InstallationEntity> {
    const installation = await this.installationRepository.findOne({
      where: { id },
      relations: ["customer"],
    });

    if (!installation) {
      throw new Error(`Installation with ID ${id} not found`);
    }

    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });

    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found`);
    }

    installation.productName = productName;
    installation.customer = customer;

    return this.installationRepository.save(installation);
  }

  /**
   * Formats installations for display in the console
   */
  formatInstallationsForDisplay(installations: InstallationEntity[]): string {
    if (installations.length === 0) {
      return "No installations found.";
    }

    let output = "\nAVAILABLE INSTALLATIONS:\n";
    output += "============================================================\n";
    output += "ID                                  | PRODUCT NAME | CUSTOMER\n";
    output += "----------------------------------------------------------\n";

    for (const installation of installations) {
      const productName = installation.productName.length > 12
        ? `${installation.productName.slice(0, 9)}...`
        : installation.productName.padEnd(12);
      
      output += `${installation.id} | ${productName} | ${installation.customer.name}\n`;
    }
    output += "============================================================\n";

    return output;
  }

  /**
   * Formats customers for display in the console
   */
  formatCustomersForDisplay(customers: CustomerEntity[]): string {
    if (customers.length === 0) {
      return "No customers found.";
    }

    let output = "\nAVAILABLE CUSTOMERS:\n";
    output += "============================================================\n";
    output += "ID                                  | NAME         | EMAIL               | PHONE\n";
    output += "----------------------------------------------------------\n";

    for (const customer of customers) {
      const name = customer.name.length > 12
        ? `${customer.name.slice(0, 9)}...`
        : customer.name.padEnd(12);
      
      const email = customer.email.length > 18
        ? `${customer.email.slice(0, 15)}...`
        : customer.email.padEnd(18);
      
      output += `${customer.id} | ${name} | ${email} | ${customer.phone}\n`;
    }
    output += "============================================================\n";

    return output;
  }
} 