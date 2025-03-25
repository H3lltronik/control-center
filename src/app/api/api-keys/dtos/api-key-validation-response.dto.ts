export class InstallationInfoDto {
  uuid = "";
  name = "";
}

export class ApiKeyValidationResponseDto {
  valid = false;
  installation?: InstallationInfoDto;
}
