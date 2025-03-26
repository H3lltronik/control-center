import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";

import { DatabaseModule } from "../common/database.module";
import { ApiModule } from "./api/api.module";
import { CoreModule } from "./core/core.module";
import { DataModule } from "./data/data.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    DatabaseModule,
    CqrsModule,
    CoreModule,
    DataModule,
    ApiModule,
  ],
  providers: [Logger]
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);
  
  constructor(private readonly configService: ConfigService) {}
  
  onModuleInit() {
    // Mostrar información de las variables de entorno al iniciar
    this.logger.log('==========================================');
    this.logger.log('Iniciando aplicación con las siguientes configuraciones:');
    this.logger.log(`NODE_ENV: ${this.configService.get('NODE_ENV', 'no definido')}`);
    this.logger.log(`PORT: ${this.configService.get('PORT', 'no definido')}`);
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
