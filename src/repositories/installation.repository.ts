import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateInstallationDto } from "../dtos/create-installation.dto";
import { Installation } from "../entities/installation.entity";
import { CustomerRepository } from "./customer.repository";

@Injectable()
export class InstallationRepository {
  constructor(
    @InjectRepository(Installation)
    private installationRepository: Repository<Installation>,
    private customerRepository: CustomerRepository,
  ) {}

  async create(
    createInstallationDto: CreateInstallationDto,
  ): Promise<Installation> {
    const { customerId, ...installationData } = createInstallationDto;

    // Find the customer
    const customer = await this.customerRepository.findOneById(customerId);
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found`);
    }

    // Create and save the installation
    const installation = this.installationRepository.create({
      ...installationData,
      customer,
    });

    return this.installationRepository.save(installation);
  }

  async findOneById(id: string): Promise<Installation | null> {
    return this.installationRepository.findOne({
      where: { id },
      relations: ["customer"],
    });
  }
}
