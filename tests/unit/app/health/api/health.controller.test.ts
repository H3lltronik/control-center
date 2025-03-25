import {
  HealthCheckService,
  HealthIndicatorResult,
  TypeOrmHealthIndicator,
} from "@nestjs/terminus";
import { Test, TestingModule } from "@nestjs/testing";

import { createMock, Mock } from "@/tests/utils/mock";

import { HealthController } from "../../../../../src/app/api/health/health.controller";

describe("HealthController", () => {
  let controller: HealthController;
  let healthService: Mock<HealthCheckService>;
  let dbIndicator: Mock<TypeOrmHealthIndicator>;

  beforeEach(async () => {
    healthService = createMock<HealthCheckService>();
    dbIndicator = createMock<TypeOrmHealthIndicator>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    })
      .useMocker(token => {
        if (token === HealthCheckService) {
          return healthService;
        }
        if (token === TypeOrmHealthIndicator) {
          return dbIndicator;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return createMock();
      })
      .compile();

    controller = module.get<HealthController>(HealthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("check", () => {
    it("should call health check service with database indicator", async () => {
      const mockHealthCheck: HealthIndicatorResult = {
        database: { status: "up" },
      };
      healthService.check.mockResolvedValue(mockHealthCheck);

      const result = await controller.check();

      expect(result).toBe(mockHealthCheck);
      expect(healthService.check).toHaveBeenCalledWith([expect.any(Function)]);
    });
  });
});
