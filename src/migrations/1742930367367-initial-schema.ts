import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1742930367367 implements MigrationInterface {
  name = "InitialSchema1742930367367";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."api_key_installation_permission_enum" AS ENUM('READ', 'WRITE', 'ADMIN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "api_key_installation" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "apiKeyUuid" uuid NOT NULL, "installationUuid" uuid NOT NULL, "permission" "public"."api_key_installation_permission_enum" NOT NULL DEFAULT 'READ', "rateLimit" integer NOT NULL DEFAULT '100', "requestCount" integer NOT NULL DEFAULT '0', "lastUsedAt" TIMESTAMP, "api_key_uuid" uuid, "installation_uuid" uuid, CONSTRAINT "PK_6d6f1b679c03d9ca6b256702798" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."logs_level_enum" AS ENUM('debug', 'info', 'warn', 'error')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."logs_source_enum" AS ENUM('frontend', 'backend')`,
    );
    await queryRunner.query(
      `CREATE TABLE "logs" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "level" "public"."logs_level_enum" NOT NULL DEFAULT 'info', "source" "public"."logs_source_enum" NOT NULL DEFAULT 'frontend', "userId" character varying, "path" character varying, "content" jsonb NOT NULL, "metadata" jsonb, "userAgent" character varying, "ipAddress" character varying, "stackTrace" text, "installationId" uuid, CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2eb771409cb38a911e659ae5f9" ON "logs" ("installationId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_10d65a4fb56f62db29ed1b1459" ON "logs" ("level") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c58b3c20b31c52ee7ba6b0d321" ON "logs" ("source") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a1196a1956403417fe3a034339" ON "logs" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b87bdecbefaa142eb2f0ee52fc" ON "logs" ("path") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1787d92b5ce793e1a58c63b67f" ON "logs" ("userId", "path") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_860ba869d89e2ac19e1eb05ac9" ON "logs" ("level", "source") `,
    );
    await queryRunner.query(
      `CREATE TABLE "installation" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "productName" character varying NOT NULL, "customerId" uuid, CONSTRAINT "PK_f0cd0b17a45357b5e1da1da1680" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."api_key_log_eventtype_enum" AS ENUM('CREATED', 'VALIDATED', 'FAILED_VALIDATION', 'REVOKED', 'EXPIRED', 'RATE_LIMITED', 'ACCESS_DENIED', 'PERMISSION_DENIED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "api_key_log" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "apiKeyUuid" uuid NOT NULL, "installationUuid" uuid, "eventType" "public"."api_key_log_eventtype_enum" NOT NULL, "description" text, "ipAddress" character varying(45), "userAgent" character varying(255), "path" character varying(255), "statusCode" integer, "metadata" jsonb NOT NULL DEFAULT '{}', "api_key_uuid" uuid, "installation_uuid" uuid, CONSTRAINT "PK_fd02dfbaa62ea4e81f7139978f3" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."api_key_status_enum" AS ENUM('active', 'revoked', 'expired')`,
    );
    await queryRunner.query(
      `CREATE TABLE "api_key" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "description" text, "status" "public"."api_key_status_enum" NOT NULL DEFAULT 'active', "expiresAt" TIMESTAMP, "installationUuid" uuid, "createdBy" character varying(50), "metadata" jsonb NOT NULL DEFAULT '{}', "lastUsedAt" TIMESTAMP, "rateLimit" integer NOT NULL DEFAULT '300', "requestCount" integer NOT NULL DEFAULT '0', "installation_uuid" uuid, CONSTRAINT "UQ_fb080786c16de6ace7ed0b69f7d" UNIQUE ("key"), CONSTRAINT "PK_f07cf6dbb3ed3600a5511578f81" PRIMARY KEY ("uuid"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_key_installation" ADD CONSTRAINT "FK_81ee0a3120e078fbc6c9d7e9e7d" FOREIGN KEY ("api_key_uuid") REFERENCES "api_key"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_key_installation" ADD CONSTRAINT "FK_1401bc45b855d97f7bcdf4e6a9a" FOREIGN KEY ("installation_uuid") REFERENCES "installation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs" ADD CONSTRAINT "FK_2eb771409cb38a911e659ae5f9f" FOREIGN KEY ("installationId") REFERENCES "installation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "installation" ADD CONSTRAINT "FK_45a9aeaaecb01b0f67092fa16ba" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_key_log" ADD CONSTRAINT "FK_7358c1da4173968f5dbce8d24c3" FOREIGN KEY ("api_key_uuid") REFERENCES "api_key"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_key_log" ADD CONSTRAINT "FK_ce313b286fcf1a5dce96555fe38" FOREIGN KEY ("installation_uuid") REFERENCES "installation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_key" ADD CONSTRAINT "FK_6d6f1b679c03d9ca6b256702798" FOREIGN KEY ("installation_uuid") REFERENCES "installation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "api_key" DROP CONSTRAINT "FK_6d6f1b679c03d9ca6b256702798"`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_key_log" DROP CONSTRAINT "FK_ce313b286fcf1a5dce96555fe38"`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_key_log" DROP CONSTRAINT "FK_7358c1da4173968f5dbce8d24c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "installation" DROP CONSTRAINT "FK_45a9aeaaecb01b0f67092fa16ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs" DROP CONSTRAINT "FK_2eb771409cb38a911e659ae5f9f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_key_installation" DROP CONSTRAINT "FK_1401bc45b855d97f7bcdf4e6a9a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "api_key_installation" DROP CONSTRAINT "FK_81ee0a3120e078fbc6c9d7e9e7d"`,
    );
    await queryRunner.query(`DROP TABLE "api_key"`);
    await queryRunner.query(`DROP TYPE "public"."api_key_status_enum"`);
    await queryRunner.query(`DROP TABLE "api_key_log"`);
    await queryRunner.query(`DROP TYPE "public"."api_key_log_eventtype_enum"`);
    await queryRunner.query(`DROP TABLE "installation"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_860ba869d89e2ac19e1eb05ac9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1787d92b5ce793e1a58c63b67f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b87bdecbefaa142eb2f0ee52fc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a1196a1956403417fe3a034339"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c58b3c20b31c52ee7ba6b0d321"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_10d65a4fb56f62db29ed1b1459"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2eb771409cb38a911e659ae5f9"`,
    );
    await queryRunner.query(`DROP TABLE "logs"`);
    await queryRunner.query(`DROP TYPE "public"."logs_source_enum"`);
    await queryRunner.query(`DROP TYPE "public"."logs_level_enum"`);
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(`DROP TABLE "api_key_installation"`);
    await queryRunner.query(
      `DROP TYPE "public"."api_key_installation_permission_enum"`,
    );
  }
}
