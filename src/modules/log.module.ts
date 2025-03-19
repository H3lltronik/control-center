import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LogController } from "../controllers/log.controller";
import { Installation } from "../entities/installation.entity";
import { Log } from "../entities/log.entity";
import { LogRepository } from "../repositories/log.repository";
import { LogService } from "../services/log.service";

@Module({
  imports: [TypeOrmModule.forFeature([Log, Installation])],
  providers: [LogRepository, LogService],
  controllers: [LogController],
  exports: [LogService],
})
export class LogModule {}
