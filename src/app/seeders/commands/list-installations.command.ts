import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Command, CommandRunner } from "nest-commander";
import { Repository } from "typeorm";

import { InstallationEntity } from "../../data/installations/installation.entity";

@Injectable()
@Command({
  name: "list-installations",
  description: "List all installations to get their UUIDs",
})
export class ListInstallationsCommand extends CommandRunner {
  constructor(
    @InjectRepository(InstallationEntity)
    private readonly installationRepository: Repository<InstallationEntity>,
  ) {
    super();
  }

  async run(): Promise<void> {
    try {
      const installations = await this.installationRepository.find({
        relations: ["customer"],
      });

      if (installations.length === 0) {
        console.log("No installations found. Run the seed command first.");
        return;
      }

      // Mostrar tabla con información clara
      console.log("\nAVAILABLE INSTALLATIONS:");
      console.log(
        "============================================================",
      );
      console.log(
        "ID                                  | PRODUCT NAME | CUSTOMER",
      );
      console.log("----------------------------------------------------------");

      for (const installation of installations) {
        console.log(
          `${installation.id} | ${installation.productName.padEnd(
            12,
          )} | ${installation.customer.name}`,
        );
      }
      console.log(
        "============================================================\n",
      );
    } catch (error) {
      console.error(
        `❌ Error listing installations: ${(error as Error).message}`,
      );
    }
  }
}
