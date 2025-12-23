<<<<<<< HEAD
# Auto-Parts-Ecommerce
=======
# Auto-Parts E-commerce Backend

This is a Node.js backend for an auto-parts e-commerce system with automated bulk product ingestion from emails, role-based access control, and comprehensive API endpoints.

## Features

- Automated bulk product ingestion from email attachments (simulated via API)
- Role-based access control (Admin and Staff)
- JWT authentication
- Duplicate product filtering
- Only registered emails can submit products
- Excel and CSV file support for bulk uploads
- Full CRUD operations for products

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Joi for validation
- Bcrypt for password hashing
- Multer for file uploads
- XLSX and CSV-Parser for file processing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB

## Installation

1. Clone the repo
2. Install dependencies: `npm install`
3. Create a `.env` file with the following:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/auto-parts-ecommerce
JWT_SECRET=your_secret_here
NODE_ENV=development
```
4. Run the server: `npm run dev`

## API Endpoints

### Authentication
- `POST /api/register` - Register user
- `POST /api/login` - Login user

### Product Management
- `POST /api/email/products` - Bulk product ingestion (JSON, Excel, or CSV)
- `POST /api/products` - Create single product (Admin only)
- `GET /api/products` - Get all products (Admin & Staff)
- `GET /api/products/:id` - Get product by ID (Admin & Staff)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin & Staff)

## Usage

### Register and Login
First, register a user:
```
POST /api/register
{
  "email": "admin@example.com",
  "password": "password123",
  "role": "Admin"
}
```

Then login to get a JWT token:
```
POST /api/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Bulk Product Ingestion
You can upload products via:
1. JSON data:
```
POST /api/email/products
{
  "sourceEmail": "supplier@example.com",
  "products": [
    {
      "name": "Brake Pad",
      "productCode": "BP001",
      "price": 25.99
    }
  ]
}
```

2. Excel file upload (multipart/form-data):
- Send file in 'file' field
- Send sourceEmail in 'sourceEmail' field

3. CSV file upload (multipart/form-data):
- Send file in 'file' field
- Send sourceEmail in 'sourceEmail' field

### Single Product Creation (Admin only)
```
POST /api/products
Authorization: Bearer <token>
{
  "name": "Engine Oil",
  "productCode": "EO004",
  "price": 35.99
}
```

## Roles & Permissions

- Admin: Can create, read, update, delete products
- Staff: Can read and delete products
- Only registered emails can submit products via email endpoint

## File Upload Format

For Excel and CSV files, use these column names:
- Product Name (or Name, Product Name, product name)
- Product Code (or Product Code, product code, code)
- Price (or Price, Unit Price, unit price)

Example CSV:
```
Product Name,Product Code,Price
Brake Pad,BP001,25.99
Oil Filter,OF002,12.50
```

## Notes

<<<<<<< HEAD
- Only users with pre-registered emails can submit products via the email endpoint
- The product code field has a unique index to prevent duplicates
- All product names are also checked for duplicates
- The email endpoint simulates receiving bulk products from emails
- Passwords are automatically hashed before storage
- Excel and CSV files are processed to extract product data (name, productCode, price)
- The system handles JSON, Excel, and CSV file-based bulk uploads
>>>>>>> 94c1707 (Initial commit)
=======
- Products are automatically deduplicated by product code or name
- Only registered emails can submit products via the email endpoint
- Passwords are hashed before storage
- JWT tokens are required for most endpoints
- Excel formats supported: .xlsx, .xls
- CSV format supported: .csv
>>>>>>> d63f723 (make perfect code)
