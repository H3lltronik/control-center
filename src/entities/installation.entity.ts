import {
  Column,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";

import { TimestampsEntity } from "../common/timestamps-entity";
import { Customer } from "./customer.entity";
import { Log } from "./log.entity";

@Entity("installations")
export class Installation extends TimestampsEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  @Generated("uuid")
  uuid!: string;

  @Column({ type: "varchar", length: 255 })
  productName!: string;

  @ManyToOne(() => Customer, customer => customer.installations)
  customer!: Relation<Customer>;

  @OneToMany(() => Log, log => log.installation)
  logs!: Relation<Log[]>;
}
