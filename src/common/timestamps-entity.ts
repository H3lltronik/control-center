import { Column, DeleteDateColumn } from "typeorm";

export abstract class TimestampsEntity {
  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
