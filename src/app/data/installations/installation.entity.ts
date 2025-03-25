import {
  Column,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";

import { TimestampsEntity } from "../common/timestamps.entity";
import { CustomerEntity } from "../customers/customer.entity";
import { LogEntity } from "../logs/log.entity";

@Entity("installations")
export class InstallationEntity extends TimestampsEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  @Generated("uuid")
  uuid!: string;

  @Column()
  productName!: string;

  @ManyToOne(() => CustomerEntity, customer => customer.installations)
  customer!: Relation<CustomerEntity>;

  @OneToMany(() => LogEntity, log => log.installation)
  logs!: Relation<LogEntity[]>;
}
