import {
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";

import { TimestampsEntity } from "../common/timestamps-entity";
import { Installation } from "./installation.entity";

@Entity("customers")
export class Customer extends TimestampsEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  @Generated("uuid")
  uuid!: string;

  @Column({ type: "varchar", length: 255 })
  fullName!: string;

  @Column({ type: "varchar", length: 255 })
  email!: string;

  @Column({ type: "varchar", length: 50 })
  phone!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  company?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  address?: string;

  @OneToMany(() => Installation, installation => installation.customer)
  installations!: Relation<Installation>[];
}
