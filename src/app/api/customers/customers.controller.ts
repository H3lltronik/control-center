import { Controller } from "@nestjs/common";

import { CustomerService } from "../../core/customers/customer.service";

@Controller("customers")
export class CustomersController {
  constructor(private readonly customerService: CustomerService) {}
}
