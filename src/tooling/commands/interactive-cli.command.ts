import { Inject, Injectable, Logger } from "@nestjs/common";
import inquirer from "inquirer";
import { Command, CommandRunner } from "nest-commander";

import { ApiKeyPermission } from "../../app/data/api-keys/api-key-installation.entity";
import { ToolingApiKeyService } from "../services/tooling-api-key.service";
import { EnvironmentInfoService } from "../services/environment-info.service";
import { ToolingInstallationService } from "../services/tooling-installation.service";

enum MainMenuOptions {
  SHOW_ENV_INFO = "Show Environment Information",
  CUSTOMER_MANAGEMENT = "Customer Management",
  INSTALLATION_MANAGEMENT = "Installation Management",
  API_KEY_MANAGEMENT = "API Key Management",
  EXIT = "Exit",
}

enum CustomerMenuOptions {
  LIST_CUSTOMERS = "List Customers",
  CREATE_CUSTOMER = "Create Customer",
  EDIT_CUSTOMER = "Edit Customer",
  BACK = "Back to Main Menu",
}

enum InstallationMenuOptions {
  LIST_INSTALLATIONS = "List Installations",
  CREATE_INSTALLATION = "Create Installation",
  EDIT_INSTALLATION = "Edit Installation",
  BACK = "Back to Main Menu",
}

enum ApiKeyMenuOptions {
  LIST_API_KEYS = "List API Keys",
  GENERATE_API_KEY = "Generate API Key",
  BACK = "Back to Main Menu",
}

interface CustomerAnswers {
  name: string;
  email: string;
  phone: string;
}

interface InstallationAnswers {
  customerId: string;
  productName: string;
}

@Injectable()
@Command({
  name: "interactive",
  description: "Start the interactive admin CLI",
})
export class InteractiveCLICommand extends CommandRunner {
  private readonly logger = new Logger(InteractiveCLICommand.name);

  constructor(
    @Inject(EnvironmentInfoService)
    private readonly environmentInfoService: EnvironmentInfoService,
    @Inject(ToolingApiKeyService)
    private readonly apiKeyService: ToolingApiKeyService,
    @Inject(ToolingInstallationService)
    private readonly installationService: ToolingInstallationService,
  ) {
    super();
  }

  async run(): Promise<void> {
    this.clearScreen();
    this.logger.log("=== Control Center Admin CLI ===");

    // Show environment info on startup
    this.logger.log(this.environmentInfoService.getEnvironmentInfoString());

    let running = true;
    while (running) {
      const { option } = await inquirer.prompt<{ option: MainMenuOptions }>([
        {
          type: "list",
          name: "option",
          message: "Select an option:",
          choices: Object.values(MainMenuOptions),
        },
      ]);

      switch (option) {
        case MainMenuOptions.SHOW_ENV_INFO: {
          await this.showEnvironmentInfo();
          break;
        }
        case MainMenuOptions.CUSTOMER_MANAGEMENT: {
          await this.showCustomerMenu();
          break;
        }
        case MainMenuOptions.INSTALLATION_MANAGEMENT: {
          await this.showInstallationMenu();
          break;
        }
        case MainMenuOptions.API_KEY_MANAGEMENT: {
          await this.showApiKeyMenu();
          break;
        }
        case MainMenuOptions.EXIT: {
          running = false;
          this.logger.log("Exiting admin CLI...");
          break;
        }
      }
    }
  }

  private async showEnvironmentInfo(): Promise<void> {
    this.clearScreen();
    this.logger.log("=== Environment Information ===");
    this.logger.log(this.environmentInfoService.getEnvironmentInfoString());
    await this.pressAnyKeyToContinue();
  }

  private async showCustomerMenu(): Promise<void> {
    let inSubmenu = true;
    while (inSubmenu) {
      this.clearScreen();
      this.logger.log("=== Customer Management ===");

      const { option } = await inquirer.prompt<{
        option: CustomerMenuOptions;
      }>([
        {
          type: "list",
          name: "option",
          message: "Select an option:",
          choices: Object.values(CustomerMenuOptions),
        },
      ]);

      switch (option) {
        case CustomerMenuOptions.LIST_CUSTOMERS: {
          await this.listCustomers();
          break;
        }
        case CustomerMenuOptions.CREATE_CUSTOMER: {
          await this.createCustomer();
          break;
        }
        case CustomerMenuOptions.EDIT_CUSTOMER: {
          await this.editCustomer();
          break;
        }
        case CustomerMenuOptions.BACK: {
          inSubmenu = false;
          break;
        }
      }
    }
  }

  private async showInstallationMenu(): Promise<void> {
    let inSubmenu = true;
    while (inSubmenu) {
      this.clearScreen();
      this.logger.log("=== Installation Management ===");

      const { option } = await inquirer.prompt<{
        option: InstallationMenuOptions;
      }>([
        {
          type: "list",
          name: "option",
          message: "Select an option:",
          choices: Object.values(InstallationMenuOptions),
        },
      ]);

      switch (option) {
        case InstallationMenuOptions.LIST_INSTALLATIONS: {
          await this.listInstallations();
          break;
        }
        case InstallationMenuOptions.CREATE_INSTALLATION: {
          await this.createInstallation();
          break;
        }
        case InstallationMenuOptions.EDIT_INSTALLATION: {
          await this.editInstallation();
          break;
        }
        case InstallationMenuOptions.BACK: {
          inSubmenu = false;
          break;
        }
      }
    }
  }

  private async showApiKeyMenu(): Promise<void> {
    let inSubmenu = true;
    while (inSubmenu) {
      this.clearScreen();
      this.logger.log("=== API Key Management ===");

      const { option } = await inquirer.prompt<{ option: ApiKeyMenuOptions }>([
        {
          type: "list",
          name: "option",
          message: "Select an option:",
          choices: Object.values(ApiKeyMenuOptions),
        },
      ]);

      switch (option) {
        case ApiKeyMenuOptions.LIST_API_KEYS: {
          await this.listApiKeys();
          break;
        }
        case ApiKeyMenuOptions.GENERATE_API_KEY: {
          await this.generateApiKey();
          break;
        }
        case ApiKeyMenuOptions.BACK: {
          inSubmenu = false;
          break;
        }
      }
    }
  }

  private async listCustomers(): Promise<void> {
    this.clearScreen();
    this.logger.log("=== List Customers ===");

    try {
      const customers = await this.installationService.listCustomers();
      this.logger.log(
        this.installationService.formatCustomersForDisplay(customers),
      );
    } catch (error) {
      this.logger.error(`Error listing customers: ${(error as Error).message}`);
    }

    await this.pressAnyKeyToContinue();
  }

  private async createCustomer(): Promise<void> {
    this.clearScreen();
    this.logger.log("=== Create Customer ===");

    try {
      // Collect customer details
      interface CustomerAnswers {
        name: string;
        email: string;
        phone: string;
      }

      const answers = await inquirer.prompt<CustomerAnswers>([
        {
          type: "input",
          name: "name",
          message: "Enter customer name:",
          validate: (value: string) => {
            return value ? true : "Name is required";
          },
        },
        {
          type: "input",
          name: "email",
          message: "Enter customer email:",
          validate: (value: string) => {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) return "Email is required";
            if (!emailPattern.test(value)) return "Invalid email format";
            return true;
          },
        },
        {
          type: "input",
          name: "phone",
          message: "Enter customer phone:",
          validate: (value: string) => {
            return value ? true : "Phone is required";
          },
        },
      ]);

      // Create the customer
      const customer = await this.installationService.createCustomer(
        answers.name,
        answers.email,
        answers.phone,
      );

      this.logger.log("\n✅ Customer created successfully:");
      this.logger.log(`ID: ${customer.id}`);
      this.logger.log(`Name: ${customer.name}`);
      this.logger.log(`Email: ${customer.email}`);
      this.logger.log(`Phone: ${customer.phone}`);
    } catch (error) {
      this.logger.error(`Error creating customer: ${(error as Error).message}`);
    }

    await this.pressAnyKeyToContinue();
  }

  private async editCustomer(): Promise<void> {
    this.clearScreen();
    this.logger.log("=== Edit Customer ===");

    try {
      // First, list customers for reference
      const customers = await this.installationService.listCustomers();
      this.logger.log(
        this.installationService.formatCustomersForDisplay(customers),
      );

      if (customers.length === 0) {
        this.logger.log("No customers available to edit.");
        await this.pressAnyKeyToContinue();
        return;
      }

      // Select customer to edit
      const { customerId } = await inquirer.prompt<{ customerId: string }>([
        {
          type: "list",
          name: "customerId",
          message: "Select customer to edit:",
          choices: customers.map(customer => ({
            name: `${customer.name} (${customer.email})`,
            value: customer.id,
          })),
        },
      ]);

      const customerToEdit = customers.find(
        customer => customer.id === customerId,
      );

      if (!customerToEdit) {
        this.logger.error("Selected customer not found.");
        await this.pressAnyKeyToContinue();
        return;
      }

      // Collect updated customer details
      const answers = await inquirer.prompt<CustomerAnswers>([
        {
          type: "input",
          name: "name",
          message: "Enter customer name:",
          default: customerToEdit.name,
          validate: (value: string) => {
            return value ? true : "Name is required";
          },
        },
        {
          type: "input",
          name: "email",
          message: "Enter customer email:",
          default: customerToEdit.email,
          validate: (value: string) => {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) return "Email is required";
            if (!emailPattern.test(value)) return "Invalid email format";
            return true;
          },
        },
        {
          type: "input",
          name: "phone",
          message: "Enter customer phone:",
          default: customerToEdit.phone,
          validate: (value: string) => {
            return value ? true : "Phone is required";
          },
        },
      ]);

      // Update the customer
      const updatedCustomer = await this.installationService.updateCustomer(
        customerId,
        answers.name,
        answers.email,
        answers.phone,
      );

      this.logger.log("\n✅ Customer updated successfully:");
      this.logger.log(`ID: ${updatedCustomer.id}`);
      this.logger.log(`Name: ${updatedCustomer.name}`);
      this.logger.log(`Email: ${updatedCustomer.email}`);
      this.logger.log(`Phone: ${updatedCustomer.phone}`);
    } catch (error) {
      this.logger.error(`Error editing customer: ${(error as Error).message}`);
    }

    await this.pressAnyKeyToContinue();
  }

  private async listInstallations(): Promise<void> {
    this.clearScreen();
    this.logger.log("=== List Installations ===");

    try {
      const installations = await this.installationService.listInstallations();
      this.logger.log(
        this.installationService.formatInstallationsForDisplay(installations),
      );
    } catch (error) {
      this.logger.error(
        `Error listing installations: ${(error as Error).message}`,
      );
    }

    await this.pressAnyKeyToContinue();
  }

  private async createInstallation(): Promise<void> {
    this.clearScreen();
    this.logger.log("=== Create Installation ===");

    try {
      // First, list customers for reference
      const customers = await this.installationService.listCustomers();

      if (customers.length === 0) {
        this.logger.log(
          "No customers available. Please create a customer first.",
        );
        await this.pressAnyKeyToContinue();
        return;
      }

      this.logger.log("Available customers:");
      this.logger.log(
        this.installationService.formatCustomersForDisplay(customers),
      );

      // Collect installation details
      interface InstallationAnswers {
        customerId: string;
        productName: string;
      }

      const answers = await inquirer.prompt<InstallationAnswers>([
        {
          type: "list",
          name: "customerId",
          message: "Select customer for this installation:",
          choices: customers.map(customer => ({
            name: `${customer.name} (${customer.email})`,
            value: customer.id,
          })),
        },
        {
          type: "input",
          name: "productName",
          message: "Enter product name:",
          validate: (value: string) => {
            return value ? true : "Product name is required";
          },
        },
      ]);

      // Create the installation
      const installation = await this.installationService.createInstallation(
        answers.customerId,
        answers.productName,
      );

      this.logger.log("\n✅ Installation created successfully:");
      this.logger.log(`ID: ${installation.id}`);
      this.logger.log(`Product Name: ${installation.productName}`);
      this.logger.log(`Customer: ${installation.customer.name}`);
    } catch (error) {
      this.logger.error(
        `Error creating installation: ${(error as Error).message}`,
      );
    }

    await this.pressAnyKeyToContinue();
  }

  private async editInstallation(): Promise<void> {
    this.clearScreen();
    this.logger.log("=== Edit Installation ===");

    try {
      // First, list installations for reference
      const installations = await this.installationService.listInstallations();

      if (installations.length === 0) {
        this.logger.log("No installations available to edit.");
        await this.pressAnyKeyToContinue();
        return;
      }

      this.logger.log(
        this.installationService.formatInstallationsForDisplay(installations),
      );

      // Select installation to edit
      const { installationId } = await inquirer.prompt<{
        installationId: string;
      }>([
        {
          type: "list",
          name: "installationId",
          message: "Select installation to edit:",
          choices: installations.map(installation => ({
            name: `${installation.productName} (${installation.customer.name})`,
            value: installation.id,
          })),
        },
      ]);

      const installationToEdit = installations.find(
        installation => installation.id === installationId,
      );

      if (!installationToEdit) {
        this.logger.error("Selected installation not found.");
        await this.pressAnyKeyToContinue();
        return;
      }

      // Get customers for customer selection
      const customers = await this.installationService.listCustomers();

      // Collect updated installation details
      const answers = await inquirer.prompt<InstallationAnswers>([
        {
          type: "list",
          name: "customerId",
          message: "Select customer for this installation:",
          choices: customers.map(customer => ({
            name: `${customer.name} (${customer.email})`,
            value: customer.id,
          })),
          default: customers.findIndex(
            c => c.id === installationToEdit.customer.id,
          ),
        },
        {
          type: "input",
          name: "productName",
          message: "Enter product name:",
          default: installationToEdit.productName,
          validate: (value: string) => {
            return value ? true : "Product name is required";
          },
        },
      ]);

      // Update the installation
      const updatedInstallation =
        await this.installationService.updateInstallation(
          installationId,
          answers.customerId,
          answers.productName,
        );

      this.logger.log("\n✅ Installation updated successfully:");
      this.logger.log(`ID: ${updatedInstallation.id}`);
      this.logger.log(`Product Name: ${updatedInstallation.productName}`);
      this.logger.log(`Customer: ${updatedInstallation.customer.name}`);
    } catch (error) {
      this.logger.error(
        `Error editing installation: ${(error as Error).message}`,
      );
    }

    await this.pressAnyKeyToContinue();
  }

  private async listApiKeys(): Promise<void> {
    this.clearScreen();
    this.logger.log("=== List API Keys ===");

    try {
      const apiKeys = await this.apiKeyService.listApiKeys();
      this.logger.log(this.apiKeyService.formatApiKeysForDisplay(apiKeys));
    } catch (error) {
      this.logger.error(`Error listing API keys: ${(error as Error).message}`);
    }

    await this.pressAnyKeyToContinue();
  }

  private async generateApiKey(): Promise<void> {
    this.clearScreen();
    this.logger.log("=== Generate API Key ===");

    try {
      // First list installations for reference
      const installations = await this.installationService.listInstallations();

      if (installations.length === 0) {
        this.logger.log(
          "No installations available. Please create an installation first.",
        );
        await this.pressAnyKeyToContinue();
        return;
      }

      this.logger.log("Available installations:");
      this.logger.log(
        this.installationService.formatInstallationsForDisplay(installations),
      );

      // Collect installation ID and API key details
      interface ApiKeyAnswers {
        installationId: string;
        name: string;
        description?: string;
        days: number;
        rateLimit: number;
        permission: ApiKeyPermission;
      }

      const answers = await inquirer.prompt<ApiKeyAnswers>([
        {
          type: "list",
          name: "installationId",
          message: "Select installation for this API key:",
          choices: installations.map(installation => ({
            name: `${installation.productName} (${installation.customer.name})`,
            value: installation.id,
          })),
        },
        {
          type: "input",
          name: "name",
          message: "Enter a name for the API key:",
          validate: (value: string) => {
            return value ? true : "Name is required";
          },
        },
        {
          type: "input",
          name: "description",
          message: "Enter a description (optional):",
        },
        {
          type: "number",
          name: "days",
          message: "Enter expiration days (0 for never):",
          default: 0,
        },
        {
          type: "number",
          name: "rateLimit",
          message: "Enter rate limit (requests per minute):",
          default: 300,
        },
        {
          type: "list",
          name: "permission",
          message: "Select permission level:",
          choices: [
            { name: "Read Only", value: ApiKeyPermission.READ },
            { name: "Write", value: ApiKeyPermission.WRITE },
            { name: "Admin", value: ApiKeyPermission.ADMIN },
          ],
          default: ApiKeyPermission.READ,
        },
      ]);

      // Generate the API key
      const expiresInDays = answers.days > 0 ? answers.days : undefined;
      const apiKey = await this.apiKeyService.generateApiKey(
        answers.installationId,
        answers.name,
        answers.description,
        expiresInDays,
        answers.rateLimit,
        answers.permission,
      );

      this.logger.log("\n✅ API Key generated successfully:");
      this.logger.log(`UUID: ${apiKey.uuid}`);
      this.logger.log(`Key: ${apiKey.key}`);
      this.logger.log(`Name: ${apiKey.name}`);
      if (apiKey.description) {
        this.logger.log(`Description: ${apiKey.description}`);
      }
      this.logger.log(`Status: ${apiKey.status}`);
      if (apiKey.expiresAt) {
        this.logger.log(`Expires at: ${apiKey.expiresAt.toISOString()}`);
      } else {
        this.logger.log("Expires at: Never");
      }
      this.logger.log(`Rate limit: ${apiKey.rateLimit} requests per minute`);
    } catch (error) {
      this.logger.error(
        `Error generating API key: ${(error as Error).message}`,
      );
    }

    await this.pressAnyKeyToContinue();
  }

  private async pressAnyKeyToContinue(): Promise<void> {
    await inquirer.prompt({
      type: "input",
      name: "continue",
      message: "Press Enter to continue...",
    });
  }

  // Use a helper method instead of console.clear()
  private clearScreen(): void {
    // We can't avoid using console.clear() as it's the standard way to clear the terminal
    // But by centralizing it in a method, we make it clear that this is intentional
    // eslint-disable-next-line no-console
    console.clear();
  }
}
