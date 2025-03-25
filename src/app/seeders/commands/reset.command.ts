import { Inject, Injectable } from "@nestjs/common";
import { Command, CommandRunner } from "nest-commander";

import { SeedersService } from "../seeders.service";

@Injectable()
@Command({ name: "reset", description: "Reset the database (clean and seed)" })
export class ResetCommand extends CommandRunner {
  constructor(
    @Inject(SeedersService)
    private readonly seedersService: SeedersService,
  ) {
    super();
  }

  async run(): Promise<void> {
    await this.seedersService.reset();
  }
} 