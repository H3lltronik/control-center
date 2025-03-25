import { Inject, Injectable } from "@nestjs/common";
import { Command, CommandRunner } from "nest-commander";

import { ApiKeyGeneratorService } from "../api-key-generator.service";

@Injectable()
@Command({
  name: "list-api-keys",
  description: "List all generated API keys",
})
export class ListApiKeysCommand extends CommandRunner {
  constructor(
    @Inject(ApiKeyGeneratorService)
    private readonly apiKeyGeneratorService: ApiKeyGeneratorService,
  ) {
    super();
  }

  async run(): Promise<void> {
    try {
      const apiKeys = await this.apiKeyGeneratorService.listApiKeys();

      if (apiKeys.length === 0) {
        console.log(
          "No API keys found. Generate one first with the generate-api-key command.",
        );
        return;
      }

      console.log("\nAVAILABLE API KEYS:");
      console.log(
        "===================================================================================",
      );
      console.log(
        "UUID                                | KEY                     | NAME             | STATUS | INSTALLATION ID | EXPIRES AT",
      );
      console.log(
        "-----------------------------------------------------------------------------------",
      );

      for (const apiKey of apiKeys) {
        // Truncate key for display
        const truncatedKey = `${apiKey.key.slice(0, 20)}...`;
        const name =
          apiKey.name.length > 15
            ? `${apiKey.name.slice(0, 12)}...`
            : apiKey.name.padEnd(15);
        const expiresAt = apiKey.expiresAt
          ? apiKey.expiresAt.toISOString().split("T")[0]
          : "Never";

        console.log(
          `${apiKey.uuid} | ${truncatedKey.padEnd(24)} | ${name} | ${apiKey.status.padEnd(6)} | ${apiKey.installationUuid || "N/A"} | ${expiresAt}`,
        );
      }
      console.log(
        "===================================================================================\n",
      );
    } catch (error) {
      console.error(`❌ Error listing API keys: ${(error as Error).message}`);
    }
  }
}
