import { Module } from "@nestjs/common";

import { CustomersCoreModule } from "../../core/customers/customers-core.module";
import { CustomersController } from "./customers.controller";

@Module({
  imports: [CustomersCoreModule],
  controllers: [CustomersController],
})
export class CustomersApiModule {}
