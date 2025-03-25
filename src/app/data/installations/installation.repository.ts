import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CustomerEntity } from "../customers/customer.entity";
import { InstallationEntity } from "./installation.entity";

@Injectable()
export class InstallationRepository {
  constructor(
    @InjectRepository(InstallationEntity)
    private readonly repository: Repository<InstallationEntity>,
  ) {}

  async create(data: {
    productName: string;
    customer: CustomerEntity;
  }): Promise<InstallationEntity> {
    const installation = this.repository.create(data);
    return this.repository.save(installation);
  }

  async findByUuid(uuid: string): Promise<InstallationEntity | null> {
    return this.repository.findOne({ where: { uuid } });
  }

  async findById(id: string): Promise<InstallationEntity | null> {
    return this.repository.findOne({ where: { id } });
  }
}
