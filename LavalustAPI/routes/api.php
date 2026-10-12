<?php

require_once __DIR__ . '/../config/env.php';

$allowedOrigin = rtrim((string) (getenv('CORS_ALLOWED_ORIGIN') ?: ''), '/');
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
$originAllowed = $allowedOrigin !== '' && hash_equals($allowedOrigin, $requestOrigin);

if ($originAllowed) {
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept');
    header('Vary: Origin');
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code($originAllowed ? 204 : 403);
    exit;
}

require_once __DIR__ . '/../app/Controllers/AuthController.php';
require_once __DIR__ . '/../app/Controllers/ProductController.php';

function jsonResponse(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

function getBearerToken(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(.*)$/i', $header, $matches)) {
        return trim($matches[1]);
    }

    return null;
}

function requireAuth(): void
{
    $token = getBearerToken();
    if (!$token || AuthController::authenticatedUserId($token) === null) {
        jsonResponse(401, ['message' => 'Authentication required.']);
    }
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

if ($path === '/health' && $method === 'GET') {
    jsonResponse(200, ['status' => 'ok']);
}

if ($path === '/api/login' && $method === 'POST') {
    $payload = json_decode(file_get_contents('php://input'), true) ?? [];
    $response = AuthController::login($payload);
    jsonResponse($response['status'], $response);
}

if ($path === '/api/register' && $method === 'POST') {
    $payload = json_decode(file_get_contents('php://input'), true) ?? [];
    $response = AuthController::register($payload);
    jsonResponse($response['status'], $response);
}

if ($path === '/api/products' && $method === 'GET') {
    requireAuth();
    $response = ProductController::index();
    jsonResponse($response['status'] ?? 500, $response);
}

if ($path === '/api/products' && $method === 'POST') {
    requireAuth();
    $payload = json_decode(file_get_contents('php://input'), true) ?? [];
    $response = ProductController::store($payload);
    jsonResponse($response['status'] ?? 500, $response);
}

if (preg_match('#^/api/products/(\d+)$#', $path, $matches) && $method === 'PUT') {
    requireAuth();
    $payload = json_decode(file_get_contents('php://input'), true) ?? [];
    $response = ProductController::update((int) $matches[1], $payload);
    jsonResponse($response['status'] ?? 500, $response);
}

if (preg_match('#^/api/products/(\d+)$#', $path, $matches) && $method === 'DELETE') {
    requireAuth();
    $response = ProductController::destroy((int) $matches[1]);
    jsonResponse($response['status'] ?? 500, $response);
}

jsonResponse(404, ['message' => 'Route not found.']);
