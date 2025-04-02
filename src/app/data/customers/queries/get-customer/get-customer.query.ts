import { IQuery } from "@nestjs/cqrs";

export class GetCustomerByEmailQuery implements IQuery {
  constructor(public readonly email: string) {}
}
