declare module "@nestjs/terminus" {
  export class HealthCheckError extends Error {
    constructor(message: string, result: HealthIndicatorResult);
  }

  export abstract class HealthIndicator {
    protected getStatus(
      key: string,
      isHealthy: boolean,
      data?: Record<string, unknown>,
    ): HealthIndicatorResult;
  }

  export type HealthIndicatorResult = Record<
    string,
    {
      status: string;
      [key: string]: unknown;
    }
  >;

  export class HealthCheckService {
    check(
      indicators: (() =>
        | Promise<HealthIndicatorResult>
        | HealthIndicatorResult)[],
    ): Promise<HealthIndicatorResult>;
  }

  export class TypeOrmHealthIndicator {
    pingCheck(key: string): Promise<HealthIndicatorResult>;
  }

  export function HealthCheck(): MethodDecorator;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const TerminusModule: any;
}
