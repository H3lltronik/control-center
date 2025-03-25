import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class ValidateApiKeyDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  apiKey = "";
}
