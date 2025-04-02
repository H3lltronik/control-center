import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EnvironmentInfoService {
  private readonly logger = new Logger(EnvironmentInfoService.name);

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  /**
   * Displays information about the current environment
   */
  displayEnvironmentInfo(): void {
    this.logger.log("==========================================");
    this.logger.log("Current Environment Configuration:");
    this.logger.log(
      `NODE_ENV: ${this.configService.get("NODE_ENV", "no definido")}`,
    );
    this.logger.log(
      `APP_ENV: ${this.configService.get("APP_ENV", "no definido")}`,
    );
    this.logger.log(
      `DB_HOST: ${this.configService.get("DB_HOST", "no definido")}`,
    );
    this.logger.log(
      `DB_PORT: ${this.configService.get("DB_PORT", "no definido")}`,
    );

    // Additional information that might be useful
    const dbName = this.configService.get<string>("DB_NAME");
    if (dbName) this.logger.log(`DB_NAME: ${dbName}`);

    // Check execution mode
    const isDevMode = this.configService.get("NODE_ENV") === "development";
    this.logger.log(`Mode: ${isDevMode ? "Development" : "Production"}`);
    this.logger.log("==========================================");
  }

  /**
   * Gets a formatted string with environment information
   */
  getEnvironmentInfoString(): string {
    const nodeEnv = this.configService.get<string>("NODE_ENV", "no definido");
    const dbHost = this.configService.get<string>("DB_HOST", "no definido");
    const dbPort = this.configService.get<string>("DB_PORT", "no definido");
    const dbName = this.configService.get<string>("DB_NAME", "no definido");
    const isDevMode = nodeEnv === "development";

    return `
        Environment: ${nodeEnv}
        Mode: ${isDevMode ? "Development" : "Production"}
        Database: ${dbName}
        Connection: ${dbHost}:${dbPort}
    `;
  }
}
