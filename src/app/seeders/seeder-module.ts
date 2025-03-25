import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DatabaseModule } from "../../common/database.module";
import { ApiKeyEntity } from "../data/api-keys/api-key.entity";
import { ApiKeyInstallationEntity } from "../data/api-keys/api-key-installation.entity";
import { ApiKeyLogEntity } from "../data/api-keys/api-key-log.entity";
import { CustomerEntity } from "../data/customers/customer.entity";
import { InstallationEntity } from "../data/installations/installation.entity";
import { LogEntity } from "../data/logs/log.entity";
import { CleanCommand } from "./commands/clean.command";
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
    SeedersService,
    SeedCommand,
    CleanCommand,
    ResetCommand,
  ],
})
export class SeederModule implements OnModuleInit {
  /**
   * Este método se ejecuta cuando el módulo se inicializa
   */
  onModuleInit(): void {
    // Evitar el error de clase vacía
  }
}
