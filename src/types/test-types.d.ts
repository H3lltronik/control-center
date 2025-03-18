declare module "supertest" {
  function request(app: unknown): request.SuperTest;

  namespace request {
    interface SuperTest {
      get: (url: string) => Test;
      post: (url: string) => Test;
      put: (url: string) => Test;
      delete: (url: string) => Test;
    }

    interface Test {
      send: (data: unknown) => Test;
      set: (headerName: string, value: string) => Test;
      expect: (status: number) => Test;
      then: (
        callback: (response: { body: unknown; status: number }) => void,
      ) => Promise<unknown>;
    }
  }

  export = request;
}

declare module "nock" {
  function cleanAll(): void;
  function disableNetConnect(): void;
  function enableNetConnect(host?: string): void;
}
