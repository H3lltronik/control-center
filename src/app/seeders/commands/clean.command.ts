import { Inject, Injectable } from "@nestjs/common";
import { Command, CommandRunner } from "nest-commander";

import { SeedersService } from "../seeders.service";

@Injectable()
@Command({
  name: "clean",
  description: "Clean all seeded data from the database",
})
export class CleanCommand extends CommandRunner {
  constructor(
    @Inject(SeedersService)
    private readonly seedersService: SeedersService,
  ) {
    super();
  }

  async run(): Promise<void> {
    await this.seedersService.clean();
  }
} 