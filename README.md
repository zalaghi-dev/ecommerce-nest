# Ecommerce NestJS - Personal Testing Ground

⚠️ **DISCLAIMER: This is a TESTING project with NO commercial value and SHOULD NOT be used in production!**

This project is purely for personal experimentation and learning purposes. It's intentionally messy, buggy, and non-standard.

## 🚨 Important Warnings

- **NO PRODUCTION USE**: This code is not suitable for any real-world application
- **SECURITY ISSUES**: Contains deliberate security vulnerabilities for testing purposes
- **BAD PRACTICES**: Intentionally implements anti-patterns and poor coding practices
- **BUGS EVERYWHERE**: Known bugs and issues are left unfixed on purpose
- **NO SUPPORT**: No maintenance, updates, or support will be provided
- **USE AT YOUR OWN RISK**: No guarantees of functionality, security, or stability

## 🧪 What This Project Contains

A messy NestJS e-commerce-like application for testing various concepts:

### Core Modules
- **Authentication & Authorization**: JWT, roles, permissions (with deliberate flaws)
- **User Management**: CRUD operations with questionable validation
- **Products & Categories**: Basic e-commerce entities
- **Orders & Order Items**: Shopping cart and checkout simulation
- **Address Management**: User address handling
- **Tickets**: Support ticket system
- **IP Tracking**: Request monitoring (privacy nightmare)

### Technical Stack
- **Backend**: NestJS, TypeORM, PostgreSQL
- **Authentication**: Passport JWT
- **Validation**: class-validator with intentional gaps
- **Documentation**: Swagger/OpenAPI
- **Database**: Docker PostgreSQL setup
- **Testing**: Jest (barely implemented)

### Known Issues & Anti-Patterns
- Mixed authentication strategies
- Inconsistent error handling
- Poor database design
- No proper logging
- Minimal input validation
- Hardcoded credentials
- No rate limiting
- Exposed sensitive endpoints
- Mixed sync/async patterns
- Poor TypeScript usage

## 🏃‍♂️ Running This Mess

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- pnpm (or npm/yarn)

### Setup
```bash
# Install dependencies
pnpm install

# Start database
pnpm run db:up

# Run database seeder
pnpm run seed

# Start the application
pnpm run start:dev
```

### Available Scripts
```bash
pnpm run start:dev    # Development server
pnpm run build        # Build for production (why?)
pnpm run test         # Run tests (good luck)
pnpm run db:up        # Start PostgreSQL container
pnpm run db:down      # Stop database
pnpm run seed         # Seed initial data
```

### Database Access
- **Host**: localhost:5000
- **Username**: ecommerce-nest
- **Password**: ecommerce-nest
- **Database**: ecommerce-nest

## 📚 API Documentation

Once running, visit: http://localhost:3000/api/docs

## 🎯 Learning Objectives

This project helped explore:
- NestJS module system and dependency injection
- TypeORM relationships and migrations
- JWT authentication and guards
- Role-based access control
- Request/response interceptors
- Custom validators and decorators
- Docker containerization
- API documentation with Swagger

## 🔥 What NOT to Learn From This

- Security best practices
- Clean code principles
- Proper error handling
- Performance optimization
- Testing strategies
- Production deployment
- Code organization
- Git workflow

## 📝 License

UNLICENSED - Do whatever you want, but don't blame me for the consequences.

## 💡 Final Note

This project represents months of chaotic experimentation. It's a testament to what happens when you throw best practices out the window and just try stuff. Perfect for learning what NOT to do in a real project.

**Remember: This is intentionally bad code. Please don't use this as a reference for actual development work!**
