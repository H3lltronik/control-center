import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateInstallationDto {
  @IsNotEmpty()
  @IsString()
  productName!: string;

  @IsNotEmpty()
  @IsUUID()
  customerId!: string;
}
