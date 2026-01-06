# Tiny Inventory

A small full-stack inventory management system.
**Tech Stack:**

* Server: Node.js + TypeScript, Express, PostgreSQL, Prisma
* Web: React + Material UI
* Infra: Docker Compose for one-command startup

## Quick Start

```bash

# build & start (detached)
docker compose up --build -d

# apply schema
docker compose exec server npx prisma db push

# seed
docker compose exec server npm run seed

# Web: http://localhost:3000
# API: http://localhost:3001
```

## API Sketch

**Products**

- GET /api/products → List products (supports filters + pagination)
- GET /api/products/:id → Get product by ID
- POST /api/products → Create product
- PUT /api/products/:id → Update product
- DELETE /api/products/:id → Remove product

**Stores**

- GET /api/stores → List stores
- GET /api/stores/summary → Summary for all stores
- GET /api/stores/:id/summary → Summary for a single store
- GET /api/stores/:id → Get store by ID
- POST /api/stores → Create store
- PUT /api/stores/:id → Update store
- DELETE /api/stores/:id → Remove store

## Project Structure

├── server/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── db/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── validations/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── Dockerfile
│   └── package.json
│
├── web/
│   ├── src/
│   │   ├── pages/
│   │   ├── api.ts
│   │   └── App.tsx
│   └── package.json
│
├── docker-compose.yml
└── README.md

## Decisions & Trade-offs

* Focus on Server: The main intent was to build a robust backend with clear API semantics, validation, and data modeling.
* Prisma + PostgreSQL: Chosen for type safety and ease of migrations.
* React + Material UI: Provides quick UI scaffolding and a clean design system.
* Seed Strategy: Manual seeding via npm run seed after containers are up, to avoid complexity in Docker lifecycle.

## If I Had More Time

* Show backend validation and error messages on the UI.
* Add code coverage
* Improve storeSummary algorithm for better performance and richer metrics.
