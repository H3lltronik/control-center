declare module "fastify" {
  export interface FastifyInstance {
    register: (plugin: unknown, options?: Record<string, unknown>) => void;
    addHook: (
      hookName: string,
      callback: (
        request: FastifyRequest,
        reply: FastifyReply,
        done: () => void,
      ) => void,
    ) => void;
    ready: () => Promise<void>;
  }

  export interface FastifyRequest {
    headers: {
      origin?: string;
      [key: string]: string | string[] | undefined;
    };
  }

  export interface FastifyReply {
    header: (name: string, value: string) => FastifyReply;
    code: (statusCode: number) => FastifyReply;
    send: (payload: unknown) => void;
  }
}

declare module "@fastify/helmet" {
  const helmet: unknown;
  export default helmet;
}
