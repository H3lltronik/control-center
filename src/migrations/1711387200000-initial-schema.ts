import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1711387200000 implements MigrationInterface {
    name = 'InitialSchema1711387200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Customer entity
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "customer" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_customer_uuid" PRIMARY KEY ("uuid")
            )
        `);

        // Installation entity
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "installation" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "customer_uuid" uuid,
                CONSTRAINT "PK_installation_uuid" PRIMARY KEY ("uuid")
            )
        `);

        // Log entity
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "log" (
                "id" SERIAL NOT NULL,
                "level" character varying NOT NULL,
                "source" character varying NOT NULL,
                "user_id" character varying,
                "path" character varying,
                "content" jsonb NOT NULL,
                "metadata" jsonb,
                "user_agent" character varying,
                "ip_address" character varying,
                "stack_trace" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "installation_uuid" uuid,
                CONSTRAINT "PK_log_id" PRIMARY KEY ("id")
            )
        `);

        // Foreign keys
        await queryRunner.query(`
            ALTER TABLE "installation" 
            ADD CONSTRAINT "FK_installation_customer" 
            FOREIGN KEY ("customer_uuid") REFERENCES "customer"("uuid") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "log" 
            ADD CONSTRAINT "FK_log_installation" 
            FOREIGN KEY ("installation_uuid") REFERENCES "installation"("uuid") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "log" DROP CONSTRAINT "FK_log_installation"`);
        await queryRunner.query(`ALTER TABLE "installation" DROP CONSTRAINT "FK_installation_customer"`);
        await queryRunner.query(`DROP TABLE "log"`);
        await queryRunner.query(`DROP TABLE "installation"`);
        await queryRunner.query(`DROP TABLE "customer"`);
    }
} 