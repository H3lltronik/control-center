import { faker } from "@faker-js/faker";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CustomerEntity } from "../data/customers/customer.entity";
import { InstallationEntity } from "../data/installations/installation.entity";

@Injectable()
export class InstallationSeederService {
  private readonly logger = new Logger(InstallationSeederService.name);
  private readonly maxInstallationsPerCustomer = 3; // Máximo de instalaciones por cliente

  constructor(
    @InjectRepository(InstallationEntity)
    private readonly installationRepository: Repository<InstallationEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async seed(): Promise<void> {
    this.logger.log("Creating installations for customers");

    // Obtenemos todos los clientes
    const customers = await this.customerRepository.find();

    if (customers.length === 0) {
      this.logger.warn("No customers found to create installations");
      return;
    }

    const installations: InstallationEntity[] = [];

    // Para cada cliente, creamos un número aleatorio de instalaciones
    for (const customer of customers) {
      const numInstallations = faker.number.int({
        min: 1,
        max: this.maxInstallationsPerCustomer,
      });

      this.logger.log(
        `Creating ${numInstallations} installations for customer ${customer.name}`,
      );

      for (let i = 0; i < numInstallations; i++) {
        const installation = this.installationRepository.create({
          productName: faker.commerce.productName(),
          customer,
        });

        installations.push(installation);
      }
    }

    await this.installationRepository.save(installations);
    this.logger.log(
      `Created ${installations.length} installations successfully`,
    );
  }

  async clean(): Promise<void> {
    this.logger.log("Cleaning installations");
    await this.installationRepository.delete({});
    this.logger.log("Installations cleaned successfully");
  }
}
