import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class TimestampsEntity {
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
