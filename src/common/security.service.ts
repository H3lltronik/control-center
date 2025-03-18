import helmet from "@fastify/helmet";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

// Usamos nuestros propios tipos en lugar de importar fastify directamente
interface FastifyRequest {
  headers: {
    origin?: string;
    [key: string]: string | string[] | undefined;
  };
}

interface FastifyReply {
  header: (name: string, value: string) => FastifyReply;
  code: (statusCode: number) => FastifyReply;
  send: (payload: Record<string, unknown>) => void;
}

interface FastifyInstance {
  register: (plugin: unknown, options?: Record<string, unknown>) => void;
  addHook: (
    hookName: string,
    callback: (
      request: FastifyRequest,
      reply: FastifyReply,
      done: () => void,
    ) => void,
  ) => void;
}

@Injectable()
export class SecurityService {
  constructor(private readonly configService: ConfigService) {}

  setupSecurity(app: FastifyInstance): void {
    // Register Helmet for security headers
    app.register(helmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          scriptSrc: [`'self'`],
          imgSrc: [`'self'`, "data:"],
        },
      },
    });

    // Set up CORS with whitelist
    this.setupCors(app);
  }

  private setupCors(app: FastifyInstance): void {
    const nodeEnv = this.configService.get<string>("NODE_ENV", "development");
    const isProduction = nodeEnv === "production";

    // En modo desarrollo, permitimos todos los orígenes
    // En producción, usamos la whitelist configurada
    const allowedOrigins = isProduction
      ? new Set(
          this.configService
            .get<string>("ALLOWED_ORIGINS", "")
            .split(",")
            .filter(Boolean),
        )
      : undefined; // undefined indica que se permiten todos los orígenes en modo desarrollo

    // Only allow requests from whitelisted origins or all origins in dev mode
    app.addHook(
      "onRequest",
      (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
        const origin = request.headers.origin;

        // Si estamos en desarrollo o el origen está en la lista blanca
        if (!isProduction || !origin || allowedOrigins?.has(origin)) {
          if (origin) {
            void reply.header(
              "Access-Control-Allow-Origin",
              isProduction ? origin : "*",
            );
          }
          void reply.header(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS",
          );
          void reply.header(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization, X-Requested-With",
          );
          void reply.header("Access-Control-Allow-Credentials", "true");
        } else {
          // Unauthorized origin in production
          reply.code(403).send({
            statusCode: 403,
            message: "Forbidden",
            error: "Origin not allowed",
          });
        }

        done();
      },
    );
  }
}
