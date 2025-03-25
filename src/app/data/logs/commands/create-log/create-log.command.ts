import { CreateLogDto } from "../../../../api/logs/dtos/create-log.dto";
import { LogLevel, LogSource } from "../../log.entity";

// export class LogEntity extends TimestampsEntity {
//   @PrimaryGeneratedColumn("uuid")
//   id!: string;

//   @Column({ type: "uuid" })
//   @Generated("uuid")
//   uuid!: string;

//   @ManyToOne(() => InstallationEntity)
//   @Index()
//   installation!: Relation<InstallationEntity>;

//   @Column({
//     type: "enum",
//     enum: LogLevel,
//     default: LogLevel.INFO,
//   })
//   @Index()
//   level!: LogLevel;

//   @Column({
//     type: "enum",
//     enum: LogSource,
//     default: LogSource.FRONTEND,
//   })
//   @Index()
//   source!: LogSource;

//   @Column({ type: "varchar", nullable: true })
//   @Index()
//   userId?: string;

//   @Column({ type: "varchar", nullable: true })
//   @Index()
//   path?: string;

//   @Column({ type: "jsonb" })
//   content!: Record<string, unknown>;

//   @Column({ type: "jsonb", nullable: true })
//   metadata?: Record<string, unknown>;

//   @Column({ type: "varchar", nullable: true })
//   userAgent?: string;

//   @Column({ type: "varchar", nullable: true })
//   ipAddress?: string;

//   @Column({ type: "text", nullable: true })
//   stackTrace?: string;
// }

export class CreateLogCommand {
  constructor(
    public readonly data: {
      level?: LogLevel;
      source?: LogSource;
      userId?: string;
      path?: string;
      content: Record<string, unknown>;
      metadata?: Record<string, unknown>;
      userAgent?: string;
      ipAddress?: string;
      stackTrace?: string;
      installationId?: string;
    },
  ) {}
}
