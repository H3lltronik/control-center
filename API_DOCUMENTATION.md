# API de Central Control - Documentación

## Descripción General

Central Control es una API diseñada para el seguimiento y monitoreo de instalaciones de productos y la recolección de logs. La API proporciona endpoints para crear clientes, registrar instalaciones y recopilar logs de diferentes fuentes.

## Base URL

```
http://localhost:3000
```

## Seguridad

La API implementa las siguientes medidas de seguridad:

- **CORS Whitelist**: 
  - En **modo desarrollo**: Permite peticiones de cualquier origen para facilitar las pruebas.
  - En **modo producción**: Solo los orígenes permitidos (configurados mediante la variable `ALLOWED_ORIGINS`) pueden acceder a la API.
- **Helmet**: Protección contra varias vulnerabilidades web mediante encabezados HTTP seguros.
- **Validación de Entrada**: Todos los datos de entrada se validan mediante class-validator.
- **Protección TypeORM**: Protección contra inyección de SQL gracias a TypeORM.

## Endpoints

### Health

#### GET /health

Verifica si la API está funcionando correctamente y puede conectarse a la base de datos.

**Respuesta**

```json
{
  "status": "ok"
}
```

### Clientes

#### POST /customers

Crea un nuevo cliente.

**Body**

```json
{
  "fullName": "string (requerido)",
  "email": "string (requerido, formato email)",
  "phone": "string (requerido)",
  "company": "string (opcional)",
  "address": "string (opcional)"
}
```

**Respuesta**

```json
{
  "id": "uuid",
  "uuid": "uuid",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "company": "string|null",
  "address": "string|null",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "deletedAt": "datetime|null"
}
```

### Instalaciones

#### POST /installations

Registra una nueva instalación de un producto para un cliente.

**Body**

```json
{
  "productName": "string (requerido)",
  "customerId": "uuid (requerido)"
}
```

**Respuesta**

```json
{
  "id": "uuid",
  "uuid": "uuid",
  "productName": "string",
  "customer": {
    "id": "uuid",
    "uuid": "uuid",
    "fullName": "string",
    "email": "string",
    "phone": "string"
  },
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "deletedAt": "datetime|null"
}
```

### Logs

#### POST /logs

Registra un nuevo log.

**Body**

```json
{
  "installationId": "uuid (requerido)",
  "level": "enum: debug|info|warn|error (opcional, default: info)",
  "source": "enum: frontend|backend (opcional, default: frontend)",
  "userId": "string (opcional)",
  "path": "string (opcional)",
  "content": "object (requerido)",
  "metadata": "object (opcional)",
  "userAgent": "string (opcional)",
  "ipAddress": "string (opcional)",
  "stackTrace": "string (opcional)"
}
```

**Respuesta**

```json
{
  "id": "uuid",
  "uuid": "uuid",
  "installationId": "uuid",
  "level": "string",
  "source": "string",
  "userId": "string|null",
  "path": "string|null",
  "content": "object",
  "metadata": "object|null",
  "userAgent": "string|null",
  "ipAddress": "string|null",
  "stackTrace": "string|null",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "deletedAt": "datetime|null"
}
```

## Haciendo Pruebas con Postman o desde Localhost

### Modo Desarrollo

En modo desarrollo, la API acepta peticiones de cualquier origen, lo que facilita las pruebas:

1. **Postman**:
   - Simplemente envía las peticiones a `http://localhost:3000/endpoint`.
   - No se requiere configuración CORS adicional.
   - Ejemplo: `http://localhost:3000/customers` con método POST.
   - Asegúrate de incluir un header `Content-Type: application/json`.

2. **Frontend local**:
   - Puedes realizar peticiones fetch o axios directamente desde cualquier origen.
   - Ejemplo:
     ```javascript
     fetch('http://localhost:3000/logs', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         installationId: 'uuid-del-cliente',
         content: { message: 'Test log' }
       })
     })
     ```

### Modo Producción

En modo producción, solo los orígenes especificados en ALLOWED_ORIGINS pueden acceder a la API:

1. **Configurar los orígenes permitidos**:
   - Añade los orígenes permitidos en la variable de entorno ALLOWED_ORIGINS:
   - Ejemplo: `ALLOWED_ORIGINS=https://miapp.com,https://admin.miapp.com`

2. **Postman en modo producción**:
   - Añade el header `Origin` con un valor que esté en la lista blanca.
   - Ejemplo: `Origin: https://miapp.com`

3. **Para probar desde localhost en producción**:
   - Añade `http://localhost:XXXX` a la lista de ALLOWED_ORIGINS si necesitas hacer pruebas.
   - O modifica temporalmente el código para aceptar tu origen específico.

## Modelos de Datos

### Customer (Cliente)

| Campo     | Tipo    | Descripción                              |
|-----------|---------|------------------------------------------|
| id        | UUID    | ID único del cliente                     |
| uuid      | UUID    | UUID para uso externo                    |
| fullName  | String  | Nombre completo del cliente              |
| email     | String  | Correo electrónico del cliente           |
| phone     | String  | Número de teléfono del cliente           |
| company   | String  | Nombre de la empresa (opcional)          |
| address   | String  | Dirección del cliente (opcional)         |
| createdAt | Date    | Fecha de creación                        |
| updatedAt | Date    | Fecha de última actualización            |
| deletedAt | Date    | Fecha de eliminación (soft delete)       |

### Installation (Instalación)

| Campo       | Tipo    | Descripción                              |
|-------------|---------|------------------------------------------|
| id          | UUID    | ID único de la instalación               |
| uuid        | UUID    | UUID para uso externo                    |
| productName | String  | Nombre del producto instalado            |
| customer    | Cliente | Relación al cliente propietario          |
| createdAt   | Date    | Fecha de creación                        |
| updatedAt   | Date    | Fecha de última actualización            |
| deletedAt   | Date    | Fecha de eliminación (soft delete)       |

### Log

| Campo          | Tipo                   | Descripción                              |
|----------------|------------------------|------------------------------------------|
| id             | UUID                   | ID único del log                         |
| uuid           | UUID                   | UUID para uso externo                    |
| installationId | UUID                   | ID de la instalación que generó el log   |
| level          | Enum: debug,info,warn,error | Nivel de severidad del log          |
| source         | Enum: frontend,backend | Origen del log                          |
| userId         | String                 | ID del usuario (opcional)                |
| path           | String                 | Ruta o endpoint que generó el log        |
| content        | Object (JSON)          | Contenido principal del log              |
| metadata       | Object (JSON)          | Metadatos adicionales (opcional)         |
| userAgent      | String                 | User-Agent del cliente (opcional)        |
| ipAddress      | String                 | Dirección IP del cliente (opcional)      |
| stackTrace     | String                 | Traza de error (opcional)                |
| createdAt      | Date                   | Fecha de creación                        |
| updatedAt      | Date                   | Fecha de última actualización            |
| deletedAt      | Date                   | Fecha de eliminación (soft delete)       |

## Configuración

La API se configura mediante variables de entorno:

| Variable        | Descripción                         | Default                |
|-----------------|-------------------------------------|------------------------|
| PORT            | Puerto externo del servidor         | 3000                   |
| INTERNAL_PORT   | Puerto interno del servidor         | 3000                   |
| NODE_ENV        | Entorno (development/production)    | development            |
| DATABASE_HOST   | Host de PostgreSQL                  | postgres               |
| DATABASE_PORT   | Puerto externo de PostgreSQL        | 5432                   |
| DATABASE_INTERNAL_PORT | Puerto interno de PostgreSQL | 5432                   |
| DATABASE_USER   | Usuario de PostgreSQL               | postgres               |
| DATABASE_PASSWORD | Contraseña de PostgreSQL          | postgres               |
| DATABASE_NAME   | Nombre de la base de datos          | central_control        |
| DATABASE_SYNC   | Sincronización automática del esquema | true                 |
| ALLOWED_ORIGINS | Orígenes CORS permitidos (separados por comas) | http://localhost:3000,http://127.0.0.1:3000 |

## Uso de Docker

La aplicación puede ejecutarse tanto en modo desarrollo como producción usando Docker Compose:

### Desarrollo

```bash
./start-app.sh dev
```

### Producción

```bash
./start-app.sh prod
```

## Limitaciones y Seguridad

- En modo producción, la API solo permite conexiones desde los orígenes especificados en `ALLOWED_ORIGINS`.
- Se permiten métodos GET, POST y OPTIONS (necesario para preflight CORS).
- La API incluye cabeceras de seguridad configuradas por Helmet.
- No se incluyen endpoints para recuperar o eliminar datos, solo para registrarlos, siguiendo el patrón de diseño de un sistema de logging centralizado. 