import {
  Column,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";

import { ApiKeyInstallationEntity } from "../api-keys/api-key-installation.entity";
import { TimestampsEntity } from "../common/timestamps.entity";
import { CustomerEntity } from "../customers/customer.entity";
import { LogEntity } from "../logs/log.entity";

@Entity("installation")
export class InstallationEntity extends TimestampsEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  @Generated("uuid")
  uuid!: string;

  @Column({ type: "varchar" })
  productName!: string;

  @ManyToOne(() => CustomerEntity, customer => customer.installations)
  customer!: Relation<CustomerEntity>;

  @OneToMany(() => LogEntity, log => log.installation)
  logs!: Relation<LogEntity[]>;

  @OneToMany(
    () => ApiKeyInstallationEntity,
    apiKeyInstallation => apiKeyInstallation.installation,
    { cascade: true },
  )
  apiKeyInstallations?: Relation<ApiKeyInstallationEntity[]>;
}
