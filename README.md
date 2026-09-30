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

## Technologies

- Node.js
- Express.js
- Microsoft SQL Server
- JavaScript
- REST API

## API Endpoints

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

### Relationship

```text
Products
   │
   │ 1
   │
   └──────< Orders
           many