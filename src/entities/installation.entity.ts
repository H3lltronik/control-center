import {
  Column,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";

import { TimestampsEntity } from "../common/timestamps-entity";
import { Customer } from "./customer.entity";

@Entity("installations")
export class Installation extends TimestampsEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  @Generated("uuid")
  uuid!: string;

  @Column()
  productName!: string;

  @ManyToOne(() => Customer, customer => customer.installations)
  customer!: Relation<Customer>;
}
