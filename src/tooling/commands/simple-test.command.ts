import { Inject, Injectable, Logger } from "@nestjs/common";
import { Command, CommandRunner } from "nest-commander";

import { EnvironmentInfoService } from "../services/environment-info.service";

@Injectable()
@Command({
  name: "test",
  description: "Test command to verify dependency injection",
})
export class SimpleTestCommand extends CommandRunner {
  private readonly logger = new Logger(SimpleTestCommand.name);

  constructor(
    @Inject(EnvironmentInfoService)
    private readonly environmentInfoService: EnvironmentInfoService,
  ) {
    super();
  }

  async run(): Promise<void> {
    // Get environment info asynchronously to address "async method with no await" warning
    const envInfo = await Promise.resolve(
      this.environmentInfoService.getEnvironmentInfoString(),
    );

    // Clear screen before displaying output
    // eslint-disable-next-line no-console
    console.clear();

    this.logger.log("=== Test Command ===");
    this.logger.log("Environment Info:");
    this.logger.log(envInfo);
    this.logger.log("=== Test Complete ===");

    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}
