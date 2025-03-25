import { config } from "dotenv";
import path from "node:path";
import { DataSource, DataSourceOptions } from "typeorm";

// Carga el archivo .env.migration si existe
const envPath = path.resolve(process.cwd(), ".env.migration");
config({ path: envPath });

const options: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
  database: process.env.DB_NAME ?? "postgres",
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/migrations/*.js"],
  synchronize: false,
  migrationsRun: true,
  ssl:
    process.env.DB_SSL === "true"
      ? {
          rejectUnauthorized:
            process.env.DB_REJECT_UNAUTHORIZED === "true",
        }
      : false,
};

console.log(`Configuración de migración cargada desde: ${envPath}`);
console.log(`DB Host: ${options.host}, Port: ${options.port}`);

// Eliminamos el parche que alteraba directamente la propiedad readonly
// Creamos una nueva configuración con spread
const finalOptions = { ...options };
if (finalOptions.host === "postgres" && !process.env.DOCKER_ENV) {
  console.log("Ejecutando fuera de Docker, cambiando host a localhost");
  finalOptions.host = "localhost";
}

export default new DataSource(finalOptions); 