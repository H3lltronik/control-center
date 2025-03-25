import { Inject, Injectable } from "@nestjs/common";
import { Command, CommandRunner, Option } from "nest-commander";

import { ApiKeyPermission } from "../../data/api-keys/api-key-installation.entity";
import { ApiKeyGeneratorService } from "../api-key-generator.service";

interface GenerateApiKeyCommandOptions {
  installation: string;
  name: string;
  description?: string;
  days?: number;
  rateLimit?: number;
  permission?: ApiKeyPermission;
}

@Injectable()
@Command({
  name: "generate-api-key",
  description: "Generate an API key for a specific installation",
})
export class GenerateApiKeyCommand extends CommandRunner {
  constructor(
    @Inject(ApiKeyGeneratorService)
    private readonly apiKeyGeneratorService: ApiKeyGeneratorService,
  ) {
    super();
  }

  async run(
    passedParams: string[],
    options: GenerateApiKeyCommandOptions,
  ): Promise<void> {
    const { installation, name, description, days, rateLimit, permission } =
      options;

    if (!installation) {
      console.error("Installation UUID is required");
      return;
    }

    if (!name) {
      console.error("API key name is required");
      return;
    }

    try {
      const apiKey = await this.apiKeyGeneratorService.generateApiKey(
        installation,
        name,
        description,
        days,
        rateLimit,
        permission,
      );

      console.log("\n✅ API Key generated successfully:");
      console.log(`UUID: ${apiKey.uuid}`);
      console.log(`Key: ${apiKey.key}`);
      console.log(`Name: ${apiKey.name}`);
      if (apiKey.description) {
        console.log(`Description: ${apiKey.description}`);
      }
      console.log(`Status: ${apiKey.status}`);
      if (apiKey.expiresAt) {
        console.log(`Expires at: ${apiKey.expiresAt.toISOString()}`);
      } else {
        console.log("Expires at: Never");
      }
      console.log(`Rate limit: ${apiKey.rateLimit} requests per minute`);
      console.log("\n");
    } catch (error) {
      console.error(`❌ Error generating API key: ${(error as Error).message}`);
    }
  }

  @Option({
    flags: "-i, --installation <uuid>",
    description: "Installation UUID",
    required: true,
  })
  parseInstallation(val: string): string {
    return val;
  }

  @Option({
    flags: "-n, --name <name>",
    description: "API key name",
    required: true,
  })
  parseName(val: string): string {
    return val;
  }

  @Option({
    flags: "-d, --description <description>",
    description: "API key description",
  })
  parseDescription(val: string): string {
    return val;
  }

  @Option({
    flags: "--days <days>",
    description: "Expiration days (if not set, the API key will not expire)",
  })
  parseDays(val: string): number {
    return Number(val);
  }

  @Option({
    flags: "--rate-limit <rateLimit>",
    description: "Rate limit (requests per minute)",
  })
  parseRateLimit(val: string): number {
    return Number(val);
  }

  @Option({
    flags: "--permission <permission>",
    description: "API key permission (READ, WRITE, or ADMIN)",
  })
  parsePermission(val: string): ApiKeyPermission {
    const permission = val.toUpperCase() as ApiKeyPermission;
    if (
      permission !== ApiKeyPermission.READ &&
      permission !== ApiKeyPermission.WRITE &&
      permission !== ApiKeyPermission.ADMIN
    ) {
      throw new Error(
        `Invalid permission: ${val}. Must be one of: READ, WRITE, ADMIN`,
      );
    }
    return permission;
  }
}
