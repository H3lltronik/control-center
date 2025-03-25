import { Inject, Injectable } from "@nestjs/common";
import { Command, CommandRunner } from "nest-commander";

import { SeedersService } from "../seeders.service";

@Injectable()
@Command({ name: "seed", description: "Seed the database with initial data" })
export class SeedCommand extends CommandRunner {
  constructor(
    @Inject(SeedersService)
    private readonly seedersService: SeedersService,
  ) {
    super();
  }

  async run(): Promise<void> {
    await this.seedersService.seed();
  }
}
