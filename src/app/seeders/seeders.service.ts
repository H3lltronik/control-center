import { Inject, Injectable, Logger } from "@nestjs/common";

import { CustomerSeederService } from "./customer-seeder.service";
import { InstallationSeederService } from "./installation-seeder.service";

@Injectable()
export class SeedersService {
  private readonly logger = new Logger(SeedersService.name);

  constructor(
    @Inject(CustomerSeederService)
    private readonly customerSeederService: CustomerSeederService,
    @Inject(InstallationSeederService)
    private readonly installationSeederService: InstallationSeederService,
  ) {}

  async seed(): Promise<void> {
    this.logger.log("Starting seeding process...");

    // Creamos primero los clientes
    await this.customerSeederService.seed();
    this.logger.log("Customer seeding completed");

    // Luego las instalaciones que dependen de los clientes
    await this.installationSeederService.seed();
    this.logger.log("Installation seeding completed");

    this.logger.log("Seeding process completed successfully");
  }

  async clean(): Promise<void> {
    this.logger.log("Starting clean process...");

    // Primero eliminamos las instalaciones que tienen dependencia de clientes
    await this.installationSeederService.clean();
    this.logger.log("Installations cleaned");

    // Luego eliminamos los clientes
    await this.customerSeederService.clean();
    this.logger.log("Customers cleaned");

    this.logger.log("Clean process completed successfully");
  }

  async reset(): Promise<void> {
    await this.clean();
    await this.seed();
    this.logger.log("Reset completed successfully");
  }
}
