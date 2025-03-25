import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { CustomerEntity } from "../../customer.entity";
import { CustomerRepository } from "../../customer.repository";
import { GetCustomerByEmailQuery } from "./get-customer.query";

@QueryHandler(GetCustomerByEmailQuery)
export class GetCustomerByEmailHandler
  implements IQueryHandler<GetCustomerByEmailQuery>
{
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(
    query: GetCustomerByEmailQuery,
  ): Promise<CustomerEntity | null> {
    return this.customerRepository.findByEmail(query.email);
  }
}
