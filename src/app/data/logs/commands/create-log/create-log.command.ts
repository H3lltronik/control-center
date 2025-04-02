import { LogLevel, LogSource } from "../../log.entity";
export class CreateLogCommand {
  constructor(
    public readonly data: {
      level?: LogLevel;
      source?: LogSource;
      userId?: string;
      path?: string;
      content: Record<string, unknown>;
      metadata?: Record<string, unknown>;
      userAgent?: string;
      ipAddress?: string;
      stackTrace?: string;
      installationId?: string;
    },
  ) {}
}
