<<<<<<< HEAD
# Auto-Parts-Ecommerce
=======
# Auto-Parts E-commerce Backend

A Node.js backend for an auto-parts e-commerce system with automated bulk product ingestion from emails, role-based access control, and comprehensive API endpoints.

## Features

- **Automated Bulk Product Ingestion**: Process bulk product data (1k+ rows) from simulated email attachments
- **Role-Based Access Control**: Admin and Staff roles with different permissions
- **JWT Authentication**: Secure token-based authentication
- **Duplicate Filtering**: Automatic filtering of duplicate products by code or name
- **Email Registration Validation**: Only registered emails can submit products
- **Excel & CSV File Processing**: Support for both Excel and CSV file uploads containing product data
- **Comprehensive API Endpoints**: Full CRUD operations with proper permissions

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Joi for validation
- Bcrypt for password hashing
- Multer for file uploads
- XLSX for Excel processing
- CSV-Parser for CSV processing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd auto-parts-ecommerce
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/auto-parts-ecommerce
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login user and get JWT token |

### Product Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/email/products` | Bulk product ingestion from email (simulated) - supports JSON, Excel, or CSV file | Public (registered emails only) |
| POST | `/api/products` | Create a single product | Admin only |
| GET | `/api/products` | Get all products | Admin & Staff |
| GET | `/api/products/:id` | Get product by ID | Admin & Staff |
| PUT | `/api/products/:id` | Update product by ID | Admin only |
| DELETE | `/api/products/:id` | Delete product by ID | Admin & Staff |

### Request Examples

#### Register User
```json
{
  "email": "admin@example.com",
  "password": "password123",
  "role": "Admin"
}
```

#### Login User
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Bulk Product Ingestion (from email) - JSON
```json
{
  "sourceEmail": "supplier@example.com",
  "products": [
    {
      "name": "Brake Pad",
      "productCode": "BP001",
      "price": 25.99
    },
    {
      "name": "Oil Filter",
      "productCode": "OF002",
      "price": 12.50
    }
  ]
}
```

#### Bulk Product Ingestion (from email) - Excel File Upload
To upload an Excel file with products:
- Use multipart/form-data
- Include the Excel file in the `file` field
- Include the source email in the `sourceEmail` field

Example Excel file format (columns can be named differently):
| Product Name | Product Code | Price |
|--------------|--------------|-------|
| Brake Pad    | BP001        | 25.99 |
| Oil Filter   | OF002        | 12.50 |
| Air Filter   | AF003        | 18.75 |

Supported Excel formats: .xlsx, .xls

#### Bulk Product Ingestion (from email) - CSV File Upload
To upload a CSV file with products:
- Use multipart/form-data
- Include the CSV file in the `file` field
- Include the source email in the `sourceEmail` field

Example CSV file format (columns can be named differently):
```
Product Name,Product Code,Price
Brake Pad,BP001,25.99
Oil Filter,OF002,12.50
Air Filter,AF003,18.75
```

Supported CSV formats: .csv

#### Create Single Product
```json
{
  "name": "Engine Oil",
  "productCode": "EO004",
  "price": 35.99
}
```

## Role Permissions

| Role | Permissions |
|------|-------------|
| Admin | Create, read, update, delete products |
| Staff | Read, delete products |
| Unregistered Email | Cannot submit products |

## Database Models

### User Model
- `email`: Unique email address
- `password`: Hashed password
- `role`: 'Admin' or 'Staff'
- `isActive`: Boolean flag for account status

### Product Model
- `name`: Product name
- `productCode`: Unique product code (uppercase)
- `price`: Product price (positive number)
- `sourceEmail`: Email that submitted the product

## Error Handling

The application includes comprehensive error handling for:
- Authentication errors
- Authorization errors
- Validation errors
- Database errors
- Duplicate product entries
- File upload errors

## Postman Collection

A Postman collection is included in the project root: `Auto-Parts-Postman-Collection.json`
Import this collection into Postman to test all API endpoints.

## Security Features

- JWT-based authentication
- Role-based access control
- Input validation using Joi
- Password hashing with bcrypt
- Duplicate product filtering
- Email registration validation
- File type validation for Excel and CSV uploads

## Project Structure

```
auto-parts-ecommerce/
├── controllers/          # Request handlers
├── middleware/          # Authentication, authorization, validation
├── models/              # Mongoose models
├── routes/              # API route definitions
├── services/            # Business logic
├── utils/               # Utility functions (Excel/CSV processing)
├── .env                 # Environment variables
├── .gitignore
├── package.json
├── README.md
├── server.js            # Main application file
└── Auto-Parts-Postman-Collection.json
```

## Development

To run in development mode with auto-restart:
```bash
npm run dev
```

To run in production mode:
```bash
npm start
```

## Testing

To test the API endpoints, you can:
1. Import the Postman collection
2. Use the endpoints as documented above
3. Register users with different roles to test permissions
4. Test both JSON, Excel, and CSV file uploads for bulk ingestion

## Notes

- Only users with pre-registered emails can submit products via the email endpoint
- The product code field has a unique index to prevent duplicates
- All product names are also checked for duplicates
- The email endpoint simulates receiving bulk products from emails
- Passwords are automatically hashed before storage
- Excel and CSV files are processed to extract product data (name, productCode, price)
- The system handles JSON, Excel, and CSV file-based bulk uploads
>>>>>>> 94c1707 (Initial commit)
