<?php

require_once __DIR__ . '/../../config/database.php';

class ProductModel
{
    public static function ensureTableExists(PDO $pdo): void
    {
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_name VARCHAR(100) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL DEFAULT 0,
                quantity INT NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
        );
    }

    public static function all(PDO $pdo): array
    {
        $stmt = $pdo->query('SELECT * FROM products ORDER BY created_at DESC');
        return $stmt->fetchAll();
    }

    public static function create(PDO $pdo, array $data): array
    {
        $sql = 'INSERT INTO products (product_name, description, price, quantity) VALUES (:product_name, :description, :price, :quantity)';
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':product_name' => $data['product_name'],
            ':description' => $data['description'] ?? '',
            ':price' => (float) $data['price'],
            ':quantity' => (int) $data['quantity'],
        ]);

        $id = (int) $pdo->lastInsertId();
        return self::findById($pdo, $id);
    }

    public static function update(PDO $pdo, int $id, array $data): array
    {
        $sql = 'UPDATE products SET product_name = :product_name, description = :description, price = :price, quantity = :quantity WHERE id = :id';
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':product_name' => $data['product_name'],
            ':description' => $data['description'] ?? '',
            ':price' => (float) $data['price'],
            ':quantity' => (int) $data['quantity'],
            ':id' => $id,
        ]);

        return self::findById($pdo, $id);
    }

    public static function delete(PDO $pdo, int $id): bool
    {
        $stmt = $pdo->prepare('DELETE FROM products WHERE id = :id');
        return $stmt->execute([':id' => $id]);
    }

    public static function findById(PDO $pdo, int $id): ?array
    {
        $stmt = $pdo->prepare('SELECT * FROM products WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }
}
