# E-Commerce API

A RESTful E-Commerce API built with Node.js, Express.js, and Microsoft SQL Server.

## Features

- Product CRUD
- Order CRUD
- SQL Server database integration
- Product validation
- Order validation
- Number and type validation
- Whole-number quantity validation
- Foreign key relationship between Products and Orders
- Product details included in order responses
- Total amount calculation
- Error handling
- 404 handling
- Express Router structure
- Reusable helper functions
- JWT authentication
- User registration and login
- Password hashing with bcrypt
- Role-based authorization (User/Admin)
- Protected API routes

## Authentication

The API uses JWT (JSON Web Token) authentication.

### Register

```http
POST /api/auth/register
```

Example request:

```json
{
  "username": "testuser",
  "password": "123456"
}
```

### Login

```http
POST /api/auth/login
```

Example request:

```json
{
  "username": "testuser",
  "password": "123456"
}
```

The login endpoint returns an access token:

```json
{
  "accessToken": "JWT_TOKEN"
}
```

Use the token in protected requests:

```text
Authorization: Bearer JWT_TOKEN
```

### Roles

The API supports two roles:

- `User`
- `Admin`

Regular users can:
- View products
- View orders
- Create orders

Administrators can additionally:
- Create products
- Update products
- Delete products
- Update orders
- Delete orders

## Technologies

- Node.js
- Express.js
- Microsoft SQL Server
- JavaScript
- REST API
- JSON Web Token (JWT)
- bcrypt

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive a JWT |

### Products

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get a product |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/:id` | Get an order |
| POST | `/api/orders` | Create an order |
| PUT | `/api/orders/:id` | Update an order |
| DELETE | `/api/orders/:id` | Delete an order |

## Authorization

Protected endpoints require a valid JWT access token.

### Product Permissions

| Method | Endpoint | Required Role |
|---|---|---|
| GET | `/api/products` | User / Admin |
| GET | `/api/products/:id` | User / Admin |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |

### Order Permissions

| Method | Endpoint | Required Role |
|---|---|---|
| GET | `/api/orders` | User / Admin |
| GET | `/api/orders/:id` | User / Admin |
| POST | `/api/orders` | User / Admin |
| PUT | `/api/orders/:id` | Admin |
| DELETE | `/api/orders/:id` | Admin |

## Database Structure

### Products

- `Id` — Primary Key
- `Name` — Product name
- `Price` — Product price

### Orders

- `Id` — Primary Key
- `ProductId` — Foreign Key referencing `Products.Id`
- `Quantity` — Order quantity
- `OrderDate` — Date the order was created

### Users

- `Id` — Primary Key
- `Username` — Unique username
- `PasswordHash` — Hashed user password
- `Role` — User or Admin

### Relationship

```text
Products
   │
   │ 1
   │
   └──────< Orders
           many
```

Each order belongs to a product through `ProductId`.

## Validation

The API validates incoming data before sending it to SQL Server.

### Products

- Product name is required
- Price must be greater than 0
- Product ID must be a valid number

### Orders

- Product ID must be a number greater than 0
- Quantity must be a whole number greater than 0
- Product must exist before creating or updating an order
- Order ID must be a valid number

### Users

- Username is required
- Username must be unique
- Password must be at least 6 characters

## Error Handling

The API returns appropriate HTTP status codes for common errors:

- `400` — Invalid request data
- `401` — Authentication required or invalid credentials
- `403` — Access denied or invalid/expired token
- `404` — Resource not found
- `409` — Username already exists
- `500` — Server or database error

## Environment Variables

The project uses environment variables for sensitive configuration.

Create a `.env` file in the project root:

```env
DB_SERVER=YOUR_SQL_SERVER
DB_NAME=EcommerceDB
JWT_SECRET=YOUR_SECRET_KEY
```

The `.env` file should not be committed to Git.

## How to Run

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd ecommerce-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the database

Make sure Microsoft SQL Server is running and the `EcommerceDB` database is available.

Create the required `Products`, `Orders`, and `Users` tables.

Configure the database connection and JWT secret in the `.env` file.

### 4. Start the server

```bash
node server.js
```

The API will run at:

```text
http://localhost:3000
```

### 5. Test the API

You can use Thunder Client, Postman, or another API client to test the endpoints.

## Project Structure

```text
ecommerce-api/
├── server.js
├── db.js
├── .env
├── .gitignore
├── middleware/
│   ├── auth.js
│   └── role.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   └── orders.js
└── helpers/
    └── productHelper.js
```

## Example Order Response

```json
{
  "Id": "8",
  "ProductId": 1,
  "ProductName": "Laptop",
  "Price": 45000,
  "Quantity": 2,
  "TotalAmount": 90000,
  "OrderDate": "2026-09-30T16:33:52.980Z"
}
```

## Project Status

Completed RESTful E-Commerce API with Node.js, Express.js, SQL Server integration, CRUD operations, validation, error handling, database relationships, calculated order totals, JWT authentication, password hashing, and role-based authorization.