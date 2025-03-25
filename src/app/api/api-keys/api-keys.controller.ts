import type { Request } from "express";

import {
  Body,
  Controller,
  Headers,
  Ip,
  Post,
  Req,
  UnauthorizedException,
} from "@nestjs/common";

import { ApiKeyService } from "../../core/api-keys/api-key.service";
import { ApiKeyPermission } from "../../data/api-keys/api-key-installation.entity";
import { ApiKeyValidationResponseDto } from "./dtos/api-key-validation-response.dto";
import { ValidateApiKeyDto } from "./dtos/validate-api-key.dto";
import { TooManyRequestsException } from "./exceptions/too-many-requests.exception";

@Controller("api-keys")
export class ApiKeysController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post("validate")
  async validateApiKey(
    @Body() body: ValidateApiKeyDto,
    @Headers("x-installation-id") installationId?: string,
    @Headers("x-required-permission") requiredPermission?: string,
    @Ip() ip?: string,
    @Req() request?: Request,
  ): Promise<ApiKeyValidationResponseDto> {
    const permission = this.parsePermission(requiredPermission);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const userAgent = request?.headers["user-agent"];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const path = request?.url;

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    const requestContext = {
      ipAddress: ip,
      userAgent,
      path,
    };
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */

    try {
      const result = await this.apiKeyService.validateApiKey(
        body.apiKey,
        installationId,
        permission,
        requestContext,
      );

      if (!result.isValid) {
        throw new UnauthorizedException("Invalid API key");
      }

      let installation = undefined;

      if (result.installation?.installation) {
        installation = {
          uuid: result.installation.installation.uuid,
          name: result.installation.installation.productName,
        };
      } else if (result.apiKey?.installation) {
        installation = {
          uuid: result.apiKey.installation.uuid,
          name: result.apiKey.installation.productName,
        };
      }

      return {
        valid: true,
        installation,
      };
    } catch (error) {
      if (error instanceof TooManyRequestsException) {
        throw error;
      }
      throw new UnauthorizedException("Invalid API key");
    }
  }

  private parsePermission(permission?: string): ApiKeyPermission {
    if (!permission) {
      return ApiKeyPermission.READ;
    }

    switch (permission.toUpperCase()) {
      case "READ": {
        return ApiKeyPermission.READ;
      }
      case "WRITE": {
        return ApiKeyPermission.WRITE;
      }
      case "ADMIN": {
        return ApiKeyPermission.ADMIN;
      }
      default: {
        return ApiKeyPermission.READ;
      }
    }
  }
}
