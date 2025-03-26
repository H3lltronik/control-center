import { Inject, Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DatabaseModule } from "../../common/database.module";
import { ApiKeyEntity } from "../data/api-keys/api-key.entity";
import { ApiKeyInstallationEntity } from "../data/api-keys/api-key-installation.entity";
import { ApiKeyLogEntity } from "../data/api-keys/api-key-log.entity";
import { CustomerEntity } from "../data/customers/customer.entity";
import { InstallationEntity } from "../data/installations/installation.entity";
import { LogEntity } from "../data/logs/log.entity";
import { ApiKeyGeneratorService } from "./api-key-generator.service";
import { CleanCommand } from "./commands/clean.command";
import { GenerateApiKeyCommand } from "./commands/generate-api-key.command";
import { ListApiKeysCommand } from "./commands/list-api-keys.command";
import { ListInstallationsCommand } from "./commands/list-installations.command";
import { ResetCommand } from "./commands/reset.command";
import { SeedCommand } from "./commands/seed.command";
import { CustomerSeederService } from "./customer-seeder.service";
import { InstallationSeederService } from "./installation-seeder.service";
import { SeedersService } from "./seeders.service";

/**
 * Módulo específico para ejecutar los comandos de seeding
 * Se usa solo al ejecutar la aplicación en modo CLI
 */
@Module({
  imports: [
    // Importamos ConfigModule para cargar las variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env.seeder",
    }),
    // Importamos el módulo de base de datos que ya utiliza ConfigService
    DatabaseModule,
    // Registramos las entidades que necesitamos para los seeders
    TypeOrmModule.forFeature([
      CustomerEntity,
      InstallationEntity,
      ApiKeyEntity,
      ApiKeyInstallationEntity,
      ApiKeyLogEntity,
      LogEntity,
    ]),
  ],
  providers: [
    CustomerSeederService,
    InstallationSeederService,
    ApiKeyGeneratorService,
    SeedersService,
    SeedCommand,
    CleanCommand,
    ResetCommand,
    GenerateApiKeyCommand,
    ListInstallationsCommand,
    ListApiKeysCommand,
  ],
})
export class SeederModule implements OnModuleInit {
  private readonly logger = new Logger(SeederModule.name);
  
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}
  
  onModuleInit() {
    // Mostrar información de las variables de entorno al iniciar
    this.logger.log('==========================================');
    this.logger.log('Iniciando aplicación con las siguientes configuraciones:');
    this.logger.log(`NODE_ENV: ${this.configService.get('NODE_ENV', 'no definido')}`);
    this.logger.log(`DB_HOST: ${this.configService.get('DB_HOST', 'no definido')}`);
    this.logger.log(`DB_PORT: ${this.configService.get('DB_PORT', 'no definido')}`);
    
    // Información adicional que podría ser útil pero sin exponer datos sensibles
    const dbName = this.configService.get('DATABASE_NAME');
    if (dbName) this.logger.log(`DATABASE_NAME: ${dbName}`);
    
    // Verificar modo de ejecución
    const isDevMode = this.configService.get('NODE_ENV') === 'development';
    this.logger.log(`Modo: ${isDevMode ? 'Desarrollo' : 'Producción'}`);
    this.logger.log('==========================================');
  }
}
