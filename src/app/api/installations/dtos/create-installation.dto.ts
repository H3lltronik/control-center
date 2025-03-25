import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateInstallationDto {
  @IsString()
  @IsNotEmpty()
  productName!: string;

  @IsUUID()
  @IsNotEmpty()
  customerId!: string;
}
