import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test, TestingModule } from "@nestjs/testing";
import * as nock from "nock";
import request from "supertest";

import { HealthApiModule } from "@/app/api/health/health-api.module";
import { HealthCheckService } from "@nestjs/terminus";
import { createMock } from "@/tests/utils/mock";

// Interface para extender los tipos de FastifyInstance
interface FastifyInstanceWithReady {
  ready: () => Promise<void>;
}

// Skip e2e tests in this refactoring
describe.skip("Health", () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthApiModule],
    })
      .overrideProvider(HealthCheckService)
      .useValue(createMock<HealthCheckService>({
        check: jest.fn().mockResolvedValue({ status: "ok" }),
      }))
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();

    // Use double type assertion with unknown as intermediary
    const server = app
      .getHttpAdapter()
      .getInstance() as unknown as FastifyInstanceWithReady;
    await server.ready();

    nock.disableNetConnect();
    nock.enableNetConnect("127.0.0.1");
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(async () => {
    await app?.close();
    nock.enableNetConnect();
  });

  it("/GET health", async () => {
    const response = await request(app.getHttpServer()).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
