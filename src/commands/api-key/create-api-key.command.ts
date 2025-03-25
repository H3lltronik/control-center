import { randomBytes } from "node:crypto";
import * as readline from "node:readline";

import { Injectable, Optional } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Command, CommandRunner } from "nest-commander";
import { Repository } from "typeorm";

import { ApiKey } from "../../entities/api-key.entity";

// Verificar si el comando es de ayuda
const isHelpCommand = process.argv.some(
  arg => arg === "--help" || arg === "-h",
);

@Command({
  name: "create-api-key",
  description: "Create a new API key interactively",
})
@Injectable()
export class CreateApiKeyCommand extends CommandRunner {
  private rl: readline.Interface;

  constructor(
    @Optional()
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository?: Repository<ApiKey>,
  ) {
    super();
    // Si estamos en modo ayuda pero sin el repositorio, no pasa nada
    if (isHelpCommand && !this.apiKeyRepository) {
      console.debug("Modo ayuda: sin repositorio de ApiKey");
    }

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Generate a random API key
   */
  private generateApiKey(): string {
    return randomBytes(32).toString("hex");
  }

  /**
   * Prompt para preguntar al usuario
   */
  private prompt(question: string): Promise<string> {
    return new Promise(resolve => {
      this.rl.question(`${question}: `, answer => {
        resolve(answer);
      });
    });
  }

  /**
   * Cerrar la interfaz de readline
   */
  private closeReadline(): void {
    this.rl.close();
  }

  async run(): Promise<void> {
    // Si estamos en modo ayuda, no ejecutar la lógica
    if (isHelpCommand) {
      console.log("\nUso: pnpm run create-api-key");
      console.log(
        "\nEste comando te guiará paso a paso para crear una nueva API key.",
      );
      this.closeReadline();
      return;
    }

    // Verificar que tenemos el repositorio
    if (!this.apiKeyRepository) {
      console.error("Error: No se pudo conectar al repositorio de ApiKey");
      console.error("Asegúrate de que la base de datos esté disponible");
      console.error("Si estás ejecutando en local, usa NODE_ENV=local");
      console.error(
        "En un entorno Docker, verifica que los servicios estén arriba",
      );
      this.closeReadline();
      // Este es un script de CLI, por lo que es apropiado usar process.exit
      return;
    }

    try {
      console.log("\n=== API Key Creator ===\n");

      // Solicitar nombre
      const name = await this.prompt("Nombre de la API Key");
      if (!name) {
        console.error("Error: El nombre es obligatorio");
        this.closeReadline();
        return;
      }

      // Solicitar sistemas
      const systemsInput = await this.prompt(
        "Sistemas permitidos (separados por comas)",
      );
      const allowedSystems = systemsInput
        .split(",")
        .map(system => system.trim())
        .filter(Boolean);

      if (allowedSystems.length === 0) {
        console.error("Error: Debe especificar al menos un sistema");
        this.closeReadline();
        return;
      }

      // Solicitar fecha de expiración (opcional)
      const expiresAtInput = await this.prompt(
        "Fecha de expiración (YYYY-MM-DD, dejar en blanco para no expirar)",
      );
      const expiresAt = expiresAtInput ? new Date(expiresAtInput) : undefined;

      if (expiresAtInput && Number.isNaN(expiresAt?.getTime() ?? 0)) {
        console.error("Error: La fecha de expiración no es válida");
        this.closeReadline();
        return;
      }

      // Solicitar metadatos (opcional)
      const metadataInput = await this.prompt(
        "Metadatos en formato JSON (dejar en blanco para ninguno)",
      );
      let metadata: Record<string, unknown> | undefined;
      if (metadataInput) {
        try {
          metadata = JSON.parse(metadataInput) as Record<string, unknown>;
        } catch {
          console.warn(
            "El JSON proporcionado no es válido, se usará un objeto vacío",
          );
          metadata = {};
        }
      }

      // Confirmar la creación
      console.log("\n=== Resumen ===");
      console.log(`Nombre: ${name}`);
      console.log(`Sistemas: ${allowedSystems.join(", ")}`);
      console.log(
        `Expiración: ${expiresAt ? expiresAt.toLocaleDateString() : "No expira"}`,
      );
      console.log(
        `Metadatos: ${metadata ? JSON.stringify(metadata) : "No definidos"}`,
      );

      const confirmation = await this.prompt(
        "\n¿Desea crear esta API Key? (s/n)",
      );
      if (
        confirmation.toLowerCase() !== "s" &&
        confirmation.toLowerCase() !== "si" &&
        confirmation.toLowerCase() !== "sí"
      ) {
        console.log("Operación cancelada por el usuario");
        this.closeReadline();
        return;
      }

      // Generate the API key
      const key = this.generateApiKey();

      // Create the API key in the database
      const apiKey = this.apiKeyRepository.create({
        name,
        key,
        allowedSystems,
        expiresAt,
        metadata,
        isActive: true,
      });

      await this.apiKeyRepository.save(apiKey);

      console.log("\n=== API Key Created Successfully ===");
      console.log(`UUID: ${apiKey.uuid}`);
      console.log(`Name: ${apiKey.name}`);
      console.log(`API Key: ${apiKey.key}`);
      console.log(`Allowed Systems: ${apiKey.allowedSystems.join(", ")}`);
      if (apiKey.expiresAt) {
        console.log(`Expires At: ${apiKey.expiresAt.toISOString()}`);
      }
      console.log(
        "\nMake sure to securely store this API key, as you won't be able to retrieve it later!",
      );
    } catch (error) {
      console.error("Error creating API key:", error);
      // Este es un script de CLI, por lo que es apropiado usar process.exit
    } finally {
      this.closeReadline();
    }
  }
}
