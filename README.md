# Konfio Challenge - Customers API

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
  - [Hexagonal Architecture Implementation](#hexagonal-architecture-implementation)
  - [Design Patterns](#design-patterns)
  - [Infrastructure Components](#infrastructure-components)
- [Data Model](#-data-model)
  - [Entity Descriptions](#entity-descriptions)
  - [Business Rules](#business-rules)
- [Controllers](#-controllers)
  - [CustomerController](#customercontroller)
  - [PartyController](#partycontroller)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Infrastructure Deployment](#infrastructure-deployment)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Infrastructure as Code](#-infrastructure-as-code)
- [Security](#-security)
- [Monitoring and Logging](#-monitoring-and-logging)
- [Project Structure](#-project-structure)
- [Contributors](#-contributors)
- [Acknowledgments](#-acknowledgments)

## 🎯 Overview

This project implements a RESTful API for managing customer data in a banking system. It follows industry best practices, modern architectural patterns, and implements a clean architecture approach.

## 🔍 Features

- **Customer Management**: Support for both enterprise and individual customers
- **User Roles**: Admin, regular, and read-only user roles
- **Data Validation**: Tax ID verification, duplicate checking, and contact information validation
- **Infrastructure as Code**: Complete AWS infrastructure using Terraform (demonstration only)
- **CI/CD Pipeline**: Automated deployment using GitHub Actions (demonstration only)
- **Containerization**: Docker-based deployment
- **Database**: MySQL for data persistence
- **API Documentation**: OpenAPI/Swagger documentation

## 🏗 Architecture

The project follows a Clean Architecture approach with the following components:

```
konfio-customer-api/
├── src/
│   ├── domain/           # Business logic and entities
│   ├── application/      # Use cases and application services
│   ├── infrastructure/   # External services implementation
│   ├── interfaces/       # API controllers and presenters
│   └── main.ts           # Application entry point
├── test/                 # Test files
├── Dockerfile            # Container definition
└── package.json          # Dependencies
```

### Hexagonal Architecture Implementation

This project implements a hexagonal architecture (also known as ports and adapters) to create a clean separation between the business logic and external concerns:

```
┌─────────────────────────────────────────────────────────┐
│                      Application                        │
│                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │             │    │             │    │             │  │
│  │   Domain    │◄───┤ Application │◄───┤  Interfaces │  │
│  │             │    │             │    │             │  │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘  │
│         │                  │                  │          │
│         │                  │                  │          │
│         ▼                  ▼                  ▼          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │             │    │             │    │             │  │
│  │  Entities   │    │  Use Cases  │    │  Controllers│  │
│  │             │    │             │    │             │  │
│  └─────────────┘    └─────────────┘    └─────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Infrastructure                        │
│                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │             │    │             │    │             │  │
│  │  Repositories│    │  Services   │    │  Adapters   │  │
│  │             │    │             │    │             │  │
│  └─────────────┘    └─────────────┘    └─────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Key Components:

1. **Domain Layer**:
   - Contains business entities, value objects, and domain events
   - Implements business rules and validation logic
   - Defines repository interfaces (ports) that external implementations must adhere to

2. **Application Layer**:
   - Implements use cases that orchestrate domain objects
   - Defines service interfaces (ports) for external services
   - Contains application-specific business rules

3. **Interface Layer**:
   - Implements controllers and presenters
   - Handles HTTP requests and responses
   - Maps DTOs to domain objects

4. **Infrastructure Layer**:
   - Implements repository adapters for data persistence
   - Provides concrete implementations of service interfaces
   - Handles external service integrations

### Design Patterns

The project utilizes several design patterns to maintain clean code and separation of concerns:

1. **Repository Pattern**:
   - Abstracts data access logic
   - Provides a consistent interface for data operations
   - Example: `CustomerRepository` interface with MySQL implementation

2. **Factory Pattern**:
   - Creates complex objects without exposing creation logic
   - Used for creating domain entities with validation
   - Example: `CustomerFactory` for creating valid customer instances

3. **Strategy Pattern**:
   - Encapsulates algorithms in separate classes
   - Allows switching between different implementations
   - Example: Different validation strategies for enterprise vs. individual customers

4. **Command Pattern**:
   - Encapsulates a request as an object
   - Supports undoable operations
   - Example: `CreateCustomerCommand` for customer creation

5. **Event-Driven Architecture**:
   - Uses domain events for loose coupling
   - Implements event handlers for side effects
   - Example: `CustomerCreatedEvent` for triggering notifications

6. **Dependency Injection**:
   - Injects dependencies rather than creating them
   - Facilitates testing and loose coupling
   - Implemented using NestJS's DI container

### Infrastructure Components

> **Note**: The infrastructure setup with Terraform is provided as a demonstration of how the application could be deployed in a production environment. It is not required to run or test the API. This setup shows a potential infrastructure where multiple applications could coexist.

The infrastructure is defined using Terraform and includes:

- **VPC**: Network isolation with public and private subnets
- **EKS**: Kubernetes cluster for container orchestration
- **RDS**: MySQL database for data persistence
- **Security Groups**: Network security rules
- **IAM Roles**: Permissions for services

## 📊 Data Model

The application implements a domain-driven design with the following core entities and relationships:

```
Customer
├── id: string (PK)
├── name: string
├── taxId: string
├── type: CustomerType (ENTERPRISE | INDIVIDUAL)
├── createdAt: Date
├── contactInfo ───► ContactInfo (1:1)
│                     ├── id: string (PK)
│                     ├── email: string
│                     ├── phone?: string
│                     └── address?: string
└── parties ───────► Party (1:N)
                      ├── id: string (PK)
                      ├── name: string
                      ├── email: string
                      ├── role: PartyRole (ADMIN | EMPLOYEE | READ_ONLY)
                      └── customerId: string (FK)
```

### Entity Descriptions

#### Customer
Represents a banking customer, which can be either an enterprise or an individual. Enterprise customers can have multiple parties (members), while individual customers are self-contained.

#### Party
Represents a member or user associated with a customer. Parties have specific roles that determine their permissions within the system.

#### ContactInfo
Contains contact details for a customer, including email, phone, and address information.

### Business Rules

- Only enterprise customers can have multiple parties
- When a customer type changes from enterprise to individual, all associated parties are removed
- Tax ID must be unique across all customers
- Each party must have a valid role (ADMIN, EMPLOYEE, or READ_ONLY)

## 🛠 Controllers

The API is organized into two main controllers that handle customer and party operations:

### CustomerController

The `CustomerController` manages enterprise customers and their associated parties:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/enterprises` | GET | List all enterprises with pagination and filtering |
| `/enterprises/{id}` | GET | Get enterprise details by ID |
| `/enterprises` | POST | Create a new enterprise customer |
| `/enterprises/{id}` | PUT | Update enterprise information |
| `/enterprises/{id}` | DELETE | Soft delete an enterprise |
| `/enterprises/{id}/parties` | GET | List all parties associated with an enterprise |
| `/enterprises/{id}/parties/{partyId}` | POST | Add a party to an enterprise |
| `/enterprises/{id}/parties/{partyId}` | PUT | Update a party's information within an enterprise |

### PartyController

The `PartyController` manages individual parties and their relationships with enterprises:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/parties` | POST | Create a new party |
| `/parties/{partyId}` | PUT | Update party information |
| `/parties/{partyId}` | DELETE | Delete a party |
| `/parties/{partyId}/customers` | GET | Get all enterprises associated with a party |

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x
- Docker and Docker Compose
- MySQL

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/konfio_tech_challenge.git
   cd konfio_tech_challenge
   ```

2. Start the infrastructure services using Docker Compose:
   ```bash
   docker-compose up -d
   ```
   This will start the following services:
   - MySQL database
   - Redis for caching
   - Zookeeper and Kafka for event streaming

3. Verify that the database is initialized:
   ```bash
   docker-compose exec mysql mysql -u root -p -e "SHOW DATABASES;"
   # Enter the password when prompted (default: 123456)
   ```

4. Set up environment variables for the API:
   ```bash
   cd konfio-customer-api
   cp .env.example .env
   # Edit .env with your configuration
   ```
   
   Make sure the following variables are correctly set:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=123456
   DB_DATABASE=konfio_customer
   ```

5. Choose one of the following methods to start the API:

   **Option 1: Using Docker Compose**
   ```bash
   # Make sure you're in the konfio-customer-api directory
   docker-compose up -d
   ```

   **Option 2: Using npm**
   ```bash
   # Make sure you're in the konfio-customer-api directory
   npm install
   npm run start:dev
   ```

6. Access the API documentation at http://localhost:3000/api

### Infrastructure Deployment

> **Note**: The infrastructure deployment with Terraform is provided as a demonstration only and is not required to run or test the API.

1. Navigate to the infrastructure directory:
   ```bash
   cd konfio-infra
   ```

2. Initialize Terraform:
   ```bash
   terraform init
   ```

3. Plan the deployment:
   ```bash
   terraform plan
   ```

4. Apply the infrastructure:
   ```bash
   terraform apply
   ```

## 📚 API Documentation

The API documentation is provided using Swagger/OpenAPI. You can access the interactive documentation at:

```
http://localhost:{PORT}/api
```

Where `{PORT}` is the value configured in your `.env` file (default is 3000).

This Swagger UI provides:
- Complete API endpoint documentation
- Interactive testing interface
- Request/response schemas
- Authentication requirements
- Example requests

The API implements the following endpoints:

### Enterprise Endpoints

- `GET /enterprises` - List all enterprises with pagination and filtering
- `GET /enterprises/{id}` - Get enterprise details
- `POST /enterprises` - Create new enterprise
- `PUT /enterprises/{id}` - Update enterprise information
- `DELETE /enterprises/{id}` - Soft delete enterprise

### Party Endpoints

- `POST /enterprises/{id}/parties` - Add members to enterprise
- `PUT /enterprises/{id}/parties/{partyId}` - Update party
- `GET /enterprises/{id}/parties` - List all parties of an enterprise
- `GET /parties/{partyId}/enterprises` - Get all enterprises for a party

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

Run tests with coverage:

```bash
npm run test:cov
```

The coverage report will be generated in the `coverage` directory. You can view the HTML report by opening `coverage/lcov-report/index.html` in your browser.

## 🔄 CI/CD Pipeline

> **Note**: The GitHub Actions workflows are provided as a demonstration of how the application could be deployed in a CI/CD environment. They are not configured with actual secrets or connected to any cloud provider. This setup shows a potential CI/CD pipeline that could be implemented in a production environment.

The project uses GitHub Actions for continuous integration and deployment:

1. **Build**: Compiles the application and runs tests
2. **Docker**: Builds and pushes the Docker image to ECR
3. **Deploy**: Deploys the application to EKS

The pipeline is triggered on:
- Push to the `main` branch
- Manual trigger via GitHub Actions

## 🏗 Infrastructure as Code

> **Note**: The infrastructure as code with Terraform is provided as a demonstration only and is not required to run or test the API.

The infrastructure is defined using Terraform and includes:

- **VPC Module**: Network configuration with public and private subnets
- **EKS Module**: Kubernetes cluster configuration
- **RDS Module**: Database configuration
- **Security Groups Module**: Network security rules

## 🔒 Security

- **Network Security**: VPC isolation and security groups
- **Secrets Management**: Environment variables for sensitive data

## 📊 Monitoring and Logging

- **Health Checks**: Basic health check endpoint
- **Logging**: Structured logging with correlation IDs

## 🗄️ Database and Migrations

### ORM Implementation

This project uses TypeORM as the Object-Relational Mapping (ORM) framework. TypeORM provides:

- **Entity Mapping**: Automatic mapping between TypeScript classes and database tables
- **Repository Pattern**: Abstraction layer for database operations
- **Query Builder**: Type-safe query construction
- **Relationships**: Support for one-to-one, one-to-many, and many-to-many relationships

Example entity definition:

```typescript
@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  taxId: string;

  @Column({
    type: 'enum',
    enum: CustomerType,
    default: CustomerType.INDIVIDUAL
  })
  type: CustomerType;

  @OneToOne(() => ContactInfo, { cascade: true })
  @JoinColumn()
  contactInfo: ContactInfo;

  @OneToMany(() => Party, party => party.customer)
  parties: Party[];

  @CreateDateColumn()
  createdAt: Date;
}
```

### Migrations

Database migrations are managed using TypeORM's migration system. Migrations are stored in the `migrations` directory and are automatically executed when the application starts if the `DB_MIGRATE` environment variable is set to `true`.

Key features of our migration implementation:

1. **Version Control**: Each migration is versioned and tracked in the database
2. **Up/Down Methods**: Migrations include both `up` and `down` methods for applying and reverting changes
3. **Automatic Execution**: Migrations run automatically on application startup
4. **Transaction Support**: Migrations run within transactions for data consistency

Example migration:

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomerTable1234567890123 implements MigrationInterface {
  name = 'CreateCustomerTable1234567890123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "taxId" character varying NOT NULL,
        "type" "public"."customers_type_enum" NOT NULL DEFAULT 'INDIVIDUAL',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_customers_taxId" UNIQUE ("taxId"),
        CONSTRAINT "PK_customers" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "customers"`);
  }
}
```

To run migrations manually:

```bash
# Generate a new migration
npm run migration:generate

# Run migrations
npm run migration:run

# Revert the last migration
npm run migration:revert
```

## 🧩 Project Structure

```
konfio_tech_challenge/
├── konfio-customer-api/     # API application
│   ├── src/                 # Source code
│   │   ├── domain/          # Domain models and business logic
│   │   ├── application/     # Use cases and application services
│   │   └── infrastructure/  # External services implementation
│   ├── test/                # Test files
│   ├── migrations/          # Database migrations
│   ├── docker-compose.yml   # API Docker Compose configuration
│   └── Dockerfile           # API Dockerfile
├── konfio-infra/            # Infrastructure as Code (demonstration only)
├── .github/                 # GitHub Actions workflows (demonstration only)
└── docker-compose.yml       # Infrastructure Docker Compose configuration
```

## 👥 Contributors

- @snwnst - Initial work

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- AWS for cloud infrastructure
- Terraform for infrastructure as code
- Konfio for the opportunity to demonstrate my skills in this technical challenge
- Luisa Alvarado, my recruiter who has guided me through this process
