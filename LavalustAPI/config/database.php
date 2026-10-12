<?php

require_once __DIR__ . '/env.php';

function envValue(string $key, string $default = ''): string
{
    $value = $_ENV[$key] ?? getenv($key);
    if (!is_string($value) || trim($value) === '') {
        return $default;
    }

    return $value;
}

function getDatabaseConfig(): array
{
    return [
        'driver' => envValue('DB_DRIVER', 'mysql'),
        'host' => envValue('DB_HOST', 'localhost'),
        'port' => envValue('DB_PORT', '3306'),
        'database' => envValue('DB_DATABASE', 'products_db'),
        'username' => envValue('DB_USERNAME', 'root'),
        'password' => envValue('DB_PASSWORD', ''),
        'charset' => envValue('DB_CHARSET', 'utf8mb4'),
        'ssl_ca' => envValue('DB_SSL_CA'),
    ];
}

function dbConnection(): PDO
{
    $config = getDatabaseConfig();

    $dsn = sprintf(
        '%s:host=%s;port=%s;dbname=%s;charset=%s',
        $config['driver'],
        $config['host'],
        $config['port'],
        $config['database'],
        $config['charset']
    );

    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    if ($config['ssl_ca'] !== '') {
        if (!is_file($config['ssl_ca']) || !defined('PDO::MYSQL_ATTR_SSL_CA')) {
            throw new RuntimeException('A valid DB_SSL_CA certificate file is required for this database connection.');
        }

        $options[constant('PDO::MYSQL_ATTR_SSL_CA')] = $config['ssl_ca'];
        if (defined('PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT')) {
            $options[constant('PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT')] = true;
        }
    }

    $pdo = new PDO($dsn, $config['username'], $config['password'], $options);

    return $pdo;
}
