import { Column, DeleteDateColumn } from "typeorm";

export abstract class TimestampsEntity {
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @DeleteDateColumn({ type: "timestamp" })
  deletedAt?: Date;
}
