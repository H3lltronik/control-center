import { Injectable } from "@nestjs/common";
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from "@nestjs/terminus";

@Injectable()
export class FetchHealthIndicator extends HealthIndicator {
  async pingCheck(key: string, url: string): Promise<HealthIndicatorResult> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 5000); // 5 second timeout

      const response = await fetch(url, {
        signal: controller.signal,
        method: "GET",
      });

      clearTimeout(timeoutId);

      const isHealthy = response.ok;

      const result = this.getStatus(key, isHealthy, {
        url,
        statusCode: response.status,
      });

      if (isHealthy) {
        return result;
      }

      throw new HealthCheckError("Fetch failed", result);
    } catch (error) {
      const result = this.getStatus(key, false, {
        url,
        message: error instanceof Error ? error.message : "Unknown error",
      });

      throw new HealthCheckError("Fetch failed", result);
    }
  }
}
