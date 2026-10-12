<?php

require_once __DIR__ . '/../Models/ProductModel.php';

class ProductController
{
    public static function index(): array
    {
        try {
            $pdo = dbConnection();
            ProductModel::ensureTableExists($pdo);
            $products = ProductModel::all($pdo);

            return [
                'status' => 200,
                'products' => $products,
            ];
        } catch (Throwable $e) {
            error_log('Unable to load products: ' . $e->getMessage());
            return [
                'status' => 500,
                'message' => 'Unable to load products.',
            ];
        }
    }

    public static function store(array $payload): array
    {
        $productName = trim((string) ($payload['product_name'] ?? ''));
        $description = trim((string) ($payload['description'] ?? ''));
        $price = (float) ($payload['price'] ?? 0);
        $quantity = (int) ($payload['quantity'] ?? 0);

        if ($productName === '' || $description === '') {
            return [
                'status' => 422,
                'message' => 'Product name and description are required.',
            ];
        }

        try {
            $pdo = dbConnection();
            ProductModel::ensureTableExists($pdo);
            $product = ProductModel::create($pdo, [
                'product_name' => $productName,
                'description' => $description,
                'price' => $price,
                'quantity' => $quantity,
            ]);

            return [
                'status' => 201,
                'message' => 'Product added successfully!',
                'product' => $product,
            ];
        } catch (Throwable $e) {
            error_log('Unable to save product: ' . $e->getMessage());
            return [
                'status' => 500,
                'message' => 'Unable to save product.',
            ];
        }
    }

    public static function update(int $id, array $payload): array
    {
        $productName = trim((string) ($payload['product_name'] ?? ''));
        $description = trim((string) ($payload['description'] ?? ''));
        $price = (float) ($payload['price'] ?? 0);
        $quantity = (int) ($payload['quantity'] ?? 0);

        if ($productName === '' || $description === '') {
            return [
                'status' => 422,
                'message' => 'Product name and description are required.',
            ];
        }

        try {
            $pdo = dbConnection();
            ProductModel::ensureTableExists($pdo);

            $existing = ProductModel::findById($pdo, $id);
            if (!$existing) {
                return [
                    'status' => 404,
                    'message' => 'Product not found.',
                ];
            }

            $product = ProductModel::update($pdo, $id, [
                'product_name' => $productName,
                'description' => $description,
                'price' => $price,
                'quantity' => $quantity,
            ]);

            return [
                'status' => 200,
                'message' => 'Product updated successfully!',
                'product' => $product,
            ];
        } catch (Throwable $e) {
            error_log('Unable to update product: ' . $e->getMessage());
            return [
                'status' => 500,
                'message' => 'Unable to update product.',
            ];
        }
    }

    public static function destroy(int $id): array
    {
        try {
            $pdo = dbConnection();
            ProductModel::ensureTableExists($pdo);
            $existing = ProductModel::findById($pdo, $id);

            if (!$existing) {
                return [
                    'status' => 404,
                    'message' => 'Product not found.',
                ];
            }

            ProductModel::delete($pdo, $id);

            return [
                'status' => 200,
                'message' => 'Product deleted successfully!',
            ];
        } catch (Throwable $e) {
            error_log('Unable to delete product: ' . $e->getMessage());
            return [
                'status' => 500,
                'message' => 'Unable to delete product.',
            ];
        }
    }
}
