import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";

import { FetchHealthIndicator } from "../common/fetch-health.indicator";
import { HealthController } from "../controllers/health.controller";

@Module({
  imports: [TerminusModule],
  providers: [FetchHealthIndicator],
  controllers: [HealthController],
  exports: [FetchHealthIndicator],
})
export class HealthModule {}
