# API Keys Module

This module provides a secure way to manage API keys for external integrations with Control Center and its dependent systems.

## Overview

The API Keys module allows Control Center to verify the identity and permissions of external systems that interact with applications like the Checklist System. Each API key is associated with a set of allowed systems it can access.

## Features

- **API Key Verification**: Verify that an API key is valid and has permission to access a specific system
- **View API Keys**: Retrieve and view existing API keys (only available through the API, not modifiable through it)
- **Manual API Key Management**: For security reasons, API keys can only be created manually by administrators

## API Endpoints

- `GET /api/api-keys` - Get all API keys
- `GET /api/api-keys/:uuid` - Get an API key by UUID
- `POST /api/api-keys/verify` - Verify if an API key has permission to access a particular system

## Integration Flow

1. Create an API key manually in the database for the desired integration (e.g., AWS Lambda)
2. Configure the external system with the API key
3. When the external system communicates with Checklist System:
   - The external system sends the API key in its request
   - Checklist System verifies the API key by sending a request to Control Center
   - Control Center validates the key and returns whether it's valid
   - If valid, Checklist System processes the request

## API Key Properties

- `name`: Descriptive name for the API key
- `key`: The actual API key value (a cryptographically secure random string)
- `allowedSystems`: Array of system identifiers that this key can access
- `isActive`: Whether the key is active or disabled
- `lastUsedAt`: Timestamp of when the key was last used
- `expiresAt`: Optional expiration date for the key
- `metadata`: Optional JSON object with additional information

## Security Considerations

- API keys are never exposed through the API after creation
- All requests to the verification endpoint are logged
- API keys can be created with expiration dates
- Inactive API keys are automatically rejected
- API keys are tied to specific systems for fine-grained access control

## Creating API Keys Manually

For security reasons, API keys must be created manually. You can use the provided script:

```bash
# Navigate to the project root
cd /path/to/control-center

# Run the API key creation script
npm run create-api-key
# OR
node scripts/create-api-key.js
```

Follow the prompts to create a new API key.

## Example: Creating an API Key for AWS Lambda

When creating an API key for AWS Lambda to communicate with Checklist System:

1. Run the API key creation script
2. Enter a name like "AWS Lambda Integration"
3. For allowed systems, enter "checklist-system"
4. Set an expiration date if desired
5. Add metadata like `{"description": "Used by AWS Lambda to communicate with Checklist System", "owner": "DevOps Team"}`
6. Securely store the generated API key
7. Configure the AWS Lambda with this API key 