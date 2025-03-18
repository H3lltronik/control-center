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

  @Column()
  @Generated("uuid")
  uuid!: string;

  @Column()
  fullName!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column({ nullable: true })
  company?: string;

  @Column({ nullable: true })
  address?: string;

  @OneToMany(() => Installation, installation => installation.customer)
  installations!: Relation<Installation>[];
}
