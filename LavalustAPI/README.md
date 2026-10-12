# LavaLust CRUD API

This is a lightweight PHP API that follows the same CRUD flow as a LavaLust application.

## Features

- Register user
- Login user
- JWT-style bearer token authentication
- Product list
- Add product
- Edit product
- Delete product

## Setup

1. Copy `.env.example` to `.env`
2. Update your MySQL credentials
3. Run the API from the `LavalustAPI` directory with PHP's built-in server:

```bash
php -S 127.0.0.1:8001 index.php
```

## API endpoints

- POST `/api/register`
- POST `/api/login`
- GET `/api/products`
- POST `/api/products`
- PUT `/api/products/:id`
- DELETE `/api/products/:id`

All product routes require a bearer token in the Authorization header.
