export class CreateInstallationCommand {
  constructor(
    public readonly productName: string,
    public readonly customerId: string,
  ) {}
}
