import { MigrationInterface, QueryRunner } from "typeorm";

export class FixApiKeyInstallationReferences1742930367368 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Primero obtenemos los datos existentes para preservarlos
        const apiKeyInstallations = await queryRunner.query(
            `SELECT * FROM api_key_installation`
        );
        
        // Recreamos las relaciones con las propiedades correctas
        await queryRunner.query(`
            -- Deshabilitamos temporalmente las restricciones de clave foránea
            SET CONSTRAINTS ALL DEFERRED;
            
            -- Actualizamos la restricción de clave foránea en api_key_installation
            ALTER TABLE api_key_installation 
            DROP CONSTRAINT IF EXISTS "FK_api_key_installation_installation";
            
            ALTER TABLE api_key_installation 
            ADD CONSTRAINT "FK_api_key_installation_installation" 
            FOREIGN KEY ("installation_uuid") REFERENCES installation(id) 
            ON DELETE CASCADE;
        `);
        
        console.log('FixApiKeyInstallationReferences migration applied successfully');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertimos los cambios si es necesario
        await queryRunner.query(`
            -- Deshabilitamos temporalmente las restricciones de clave foránea
            SET CONSTRAINTS ALL DEFERRED;
            
            -- Restauramos la restricción original si es necesario
            ALTER TABLE api_key_installation 
            DROP CONSTRAINT IF EXISTS "FK_api_key_installation_installation";
            
            ALTER TABLE api_key_installation 
            ADD CONSTRAINT "FK_api_key_installation_installation" 
            FOREIGN KEY ("installation_uuid") REFERENCES installation(uuid) 
            ON DELETE CASCADE;
        `);
    }
} 