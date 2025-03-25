# API Key Command

Este módulo proporciona un comando de línea de comandos interactivo para crear nuevas API keys en la base de datos.

## Uso

### En entorno de desarrollo local

```bash
# Ver la ayuda
pnpm run create-api-key:help

# Iniciar el creador interactivo de API Keys
pnpm run create-api-key
```

### En entorno Docker

```bash
# Ver la ayuda
docker-compose exec app yarn create-api-key --help

# Iniciar el creador interactivo de API Keys
docker-compose exec app yarn create-api-key
```

## Flujo interactivo

El comando le guiará paso a paso a través de un proceso interactivo:

1. **Nombre de la API Key**: Ingrese un nombre descriptivo para identificar esta API key.
2. **Sistemas permitidos**: Lista de sistemas a los que la API key tendrá acceso, separados por comas.
3. **Fecha de expiración**: (Opcional) Fecha en formato YYYY-MM-DD cuando la API key expirará.
4. **Metadatos**: (Opcional) Información adicional en formato JSON.
5. **Confirmación**: Revisión de los datos y confirmación final.

## Ejemplos de entrada

### Sistemas permitidos
```
Sistemas permitidos (separados por comas): sistema1,sistema2,sistema3
```

### Fecha de expiración
```
Fecha de expiración (YYYY-MM-DD, dejar en blanco para no expirar): 2025-12-31
```

### Metadatos
```
Metadatos en formato JSON (dejar en blanco para ninguno): {"propietario":"Juan","departamento":"IT"}
```

## Notas

- Una vez creada la API key, el valor generado se mostrará solo una vez. Asegúrate de guardarlo en un lugar seguro.
- Las API keys son personales y no deben compartirse entre diferentes usuarios o sistemas.
- Si necesitas revocar una API key, puedes desactivarla desde el panel de administración. 