# Central Control

Central Control is a monitoring and tracking application for client installations and system logs. It provides a centralized way to collect and monitor logs from various client installations.

## Features

- Track customers and their product installations
- Collect and store logs from various client applications
- Secure API with CORS protection and IP whitelisting
- Health monitoring endpoints

## Tech Stack

- NestJS with Fastify
- PostgreSQL with TypeORM
- Docker for containerization

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 20.x or higher
- pnpm 9.x or npm

### Installation

1. Clone the repository
2. Copy `.env.example` to `.env` and configure as needed
3. Install dependencies:
   ```bash
   npm install
   ```

> **Note about dependency issues**: If you encounter dependency conflicts with vitest or other packages, please see `DEPENDENCY_ISSUES.md` for detailed solutions.

### Development

Para ejecutar la aplicación en modo desarrollo:

```bash
# Usando el script de ayuda
./start-app.sh dev

# O directamente con docker-compose
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Production

Para ejecutar la aplicación en modo producción:

```bash
# Usando el script de ayuda
./start-app.sh prod

# O directamente con docker-compose
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Detener la aplicación

```bash
docker-compose down
```

## API Endpoints

- `POST /api/logs` - Create a new log entry
- `POST /api/customers` - Create a new customer
- `POST /api/installations` - Create a new installation
- `GET /api/health` - Health check endpoint

## Security

This application implements several security measures:

- Helmet for secure HTTP headers
- CORS protection with origin whitelisting
- Input validation using class-validator
- TypeORM for SQL injection protection

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | The external port the server is exposed on | 3000 |
| INTERNAL_PORT | The internal port the server runs on | 3000 |
| DATABASE_HOST | PostgreSQL host | postgres |
| DATABASE_PORT | External PostgreSQL port | 5432 |
| DATABASE_INTERNAL_PORT | Internal PostgreSQL port | 5432 |
| DATABASE_USER | PostgreSQL username | postgres |
| DATABASE_PASSWORD | PostgreSQL password | postgres |
| DATABASE_NAME | PostgreSQL database name | central_control |
| DATABASE_SYNC | Enable TypeORM synchronization | true |
| ALLOWED_ORIGINS | Comma-separated list of allowed CORS origins | http://localhost:3000,http://127.0.0.1:3000 |

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="images/nestjs.png" alt="Nest Logo" width="512" /></a>
</p>

<h1 align="center">⭐ NestJS Service Template ⭐</h1>

<p align="center">
  Template for new services based on NestJS with the Best Practices and Ready for Production
</p>

<p align="center">
  <a href="https://github.com/AlbertHernandez/nestjs-service-template/actions/workflows/node.yml?branch=main"><img src="https://github.com/AlbertHernandez/nestjs-service-template/actions/workflows/node.yml/badge.svg?branch=main" alt="nodejs"/></a>
  <a href="https://nodejs.org/docs/latest-v22.x/api/index.html"><img src="https://img.shields.io/badge/node-22.x-green.svg" alt="node"/></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/typescript-5.x-blue.svg" alt="typescript"/></a>
  <a href="https://pnpm.io/"><img src="https://img.shields.io/badge/pnpm-9.x-red.svg" alt="pnpm"/></a>
  <a href="https://fastify.dev/"><img src="https://img.shields.io/badge/Web_Framework-Fastify_⚡-black.svg" alt="fastify"/></a>
  <a href="https://swc.rs/"><img src="https://img.shields.io/badge/Compiler-SWC_-orange.svg" alt="swc"/></a>
  <a href="https://vitest.dev/"><img src="https://img.shields.io/badge/Test-Vitest_-yellow.svg" alt="swc"/></a>
  <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Dockerized 🐳_-blue.svg" alt="docker"/></a>
</p>

## 👀 Motivation

When we start creating some new service based on NestJS most often we just use the Nest cli for starting a new service that already give us some convention and structure for our project. This is a good starting point however I was missing a couple of interesting things that almost all services should have to be ready to deploy to production like fully dockerized, ensuring coding conventions...

For this reason I created this custom template for new services based on this framework, with everything I would like to have to start developing a service with the best practices but with a simple file structure so later developers can change to implement their logic.

Here we are not providing any specific architecture like hexagonal architecture or others, this is like a simple template where later we can customize and create the architecture we need.

## 🌟 What is including this template?

1. 🐳 Fully dockerized service ready for development and production environments with the best practices for docker, trying to provide a performance and small image just with the code we really need in your environments.
2. 👷 Use [SWC](https://swc.rs/) for compiling and running the tests of the service. As commented in the own [NestJS docs](https://docs.nestjs.com/recipes/swc), this is approximately x20 times faster than default typescript compiler that is the one that comes by default in NestJS.
3. ⚡️ Use [Fastify](https://fastify.dev/) as Web Framework. By default, [NestJS is using Express](https://docs.nestjs.com/techniques/performance) because is the most widely-used framework for working with NodeJS, however, this does not imply is the one is going to give us the most performance. Also, NestJS is fully compatible with Fastify, so we are providing this integration by default. You can check [here](https://github.com/fastify/benchmarks#benchmarks) comparison between different web frameworks.
4. 🐶 Integration with [husky](https://typicode.github.io/husky/) to ensure we have good quality and conventions while we are developing like:
   - 💅 Running the linter over the files that have been changed
   - 💬 Use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) to ensure our commits have a convention.
   - ✅ Run the tests automatically.
   - ⚙️ Check our project does not have type errors with Typescript.
   - 🙊 Check typos to ensure we don't have grammar mistakes.
5. 🗂️ Separate tests over production code. By default, NestJS is combining in the same folder, the `src`, the unit tests and the code we are developing for production. This is something I personally don't like so here I am separating this and having a dedicated folder for the unit tests.
6. 🧪 Testing with [Vitest](https://vitest.dev/) and [supertest](https://github.com/ladjs/supertest) for unit and e2e tests.
7. 🏎️ Performance testing using [k6](https://grafana.com/oss/k6/).
8. 🤜🤛 Combine unit and e2e test coverage. In the services we may have both type of tests, unit and e2e tests, and usually we would like to see what is the combined test coverage, so we can see the full picture.
9. 📌 Custom path aliases, where you can define your own paths (you will be able to use imports like `@/shared/logger` instead of `../../../src/shared/logger`).
10. 🚀 CI/CD using GitHub Actions, helping ensure a good quality of our code and providing useful insights about dependencies, security vulnerabilities and others.
11. 🐦‍🔥 Usage of ESModules instead of CommonJS, which is the standard in JavaScript.
12. 📦 Use of [pnpm](https://pnpm.io/) as package manager, which is faster and more efficient than npm or yarn.

## 🤩 Other templates

Are you thinking in start new projects in other frameworks or create a super fancy library? If you like this template there are others base on this you can check:

- [Template for new Typescript Libraries](https://github.com/AlbertHernandez/typescript-library-template)
- [Template for new Typescript Express Services](https://github.com/AlbertHernandez/express-typescript-service-template)
- [Template for new GitHub Actions based on NodeJS](https://github.com/AlbertHernandez/github-action-nodejs-template)

## 🧑‍💻 Developing

First, we will need to create our .env file, we can create a copy from the example one:

```bash
cp .env.example .env
```

Now, we will need to install `pnpm` globally, you can do it running:

```bash
npm install -g pnpm@9.14.2
```

The project is fully dockerized 🐳, if we want to start the app in **development mode**, we just need to run:

```bash
docker-compose up -d my-service-dev
```

This development mode will work with **hot-reload** and expose a **debug port**, port `9229`, so later we can connect to it from our editor.

Now, you should be able to start debugging configuring using your IDE. For example, if you are using vscode, you can create a `.vscode/launch.json` file with the following configuration:

```json
{
  "version": "0.1.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to docker",
      "restart": true,
      "port": 9229,
      "remoteRoot": "/app"
    }
  ]
}
```

Also, if you want to run the **production mode**, you can run:

```bash
docker-compose up -d my-service-production
```

This service is providing just a health endpoint which you can call to verify the service is working as expected:

```bash
curl --request GET \
  --url http://localhost:3000/health
```

If you want to stop developing, you can stop the service running:

```bash
docker-compose down
```

## ⚙️ Building

```bash
node --run build
```

## ✅ Testing

The service provide different scripts for running the tests, to run all of them you can run:

```bash
node --run test
```

If you are interested just in the unit tests, you can run:

```bash
node --run test:unit
```

Or if you want e2e tests, you can execute:

```bash
node --run test:e2e
```

We also have performance testing with [k6](https://k6.io/), if you want to run it via docker, execute:

```bash
docker-compose up k6
```

Or if you want to run it from your machine, execute:

```bash
brew install k6
node --run test:performance
```

## 💅 Linting

To run the linter you can execute:

```bash
node --run lint
```

And for trying to fix lint issues automatically, you can run:

```bash
node --run lint:fix
```
