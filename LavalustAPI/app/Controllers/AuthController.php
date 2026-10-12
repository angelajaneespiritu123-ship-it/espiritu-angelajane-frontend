<?php

require_once __DIR__ . '/../../config/app.php';
require_once __DIR__ . '/../Models/UserModel.php';

class AuthController
{
    private static function createToken(int $userId): string
    {
        $payload = rtrim(strtr(base64_encode(json_encode([
            'sub' => $userId,
            'exp' => time() + 28800,
        ], JSON_THROW_ON_ERROR)), '+/', '-_'), '=');
        $signature = hash_hmac('sha256', $payload, appConfig()['jwt_secret']);
        return $payload . '.' . $signature;
    }

    public static function authenticatedUserId(string $token): ?int
    {
        $parts = explode('.', $token, 2);
        if (count($parts) !== 2) {
            return null;
        }

        [$payload, $signature] = $parts;
        $expectedSignature = hash_hmac('sha256', $payload, appConfig()['jwt_secret']);
        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }

        $decodedPayload = base64_decode(strtr($payload, '-_', '+/'));
        $claims = $decodedPayload === false ? null : json_decode($decodedPayload, true);
        if (!is_array($claims) || (int) ($claims['exp'] ?? 0) <= time()) {
            return null;
        }

        $userId = (int) ($claims['sub'] ?? 0);
        return $userId > 0 ? $userId : null;
    }

    public static function login(array $payload): array
    {
        $username = trim((string) ($payload['username'] ?? ''));
        $password = (string) ($payload['password'] ?? '');

        if ($username === '' || $password === '') {
            return [
                'status' => 422,
                'message' => 'Username and password are required.',
            ];
        }

        try {
            $pdo = dbConnection();
            UserModel::ensureTableExists($pdo);
            $user = UserModel::findByUsername($pdo, $username);
        } catch (Throwable $e) {
            error_log('Unable to log in: ' . $e->getMessage());
            return ['status' => 500, 'message' => 'Unable to log in.'];
        }

        if (!$user || !password_verify($password, $user['password_hash'])) {
            return ['status' => 401, 'message' => 'Invalid username or password.'];
        }

        return [
            'status' => 200,
            'message' => 'Login successful',
            'user' => [
                'id' => (int) $user['id'],
                'username' => $user['username'],
            ],
            'tokens' => [
                'access_token' => self::createToken((int) $user['id']),
            ],
        ];
    }

    public static function register(array $payload): array
    {
        $username = trim((string) ($payload['username'] ?? ''));
        $email = trim((string) ($payload['email'] ?? ''));
        $password = (string) ($payload['password'] ?? '');

        if ($username === '' || $email === '' || $password === '') {
            return [
                'status' => 422,
                'message' => 'Please complete all fields.',
            ];
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 8) {
            return [
                'status' => 422,
                'message' => 'Enter a valid email and a password of at least 8 characters.',
            ];
        }

        try {
            $pdo = dbConnection();
            UserModel::ensureTableExists($pdo);
            $userId = UserModel::create($pdo, $username, $email, password_hash($password, PASSWORD_DEFAULT));
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') {
                return ['status' => 409, 'message' => 'Username or email is already registered.'];
            }

            error_log('Unable to register account: ' . $e->getMessage());
            return ['status' => 500, 'message' => 'Unable to register account.'];
        } catch (Throwable $e) {
            error_log('Unable to register account: ' . $e->getMessage());
            return ['status' => 500, 'message' => 'Unable to register account.'];
        }

        return [
            'status' => 201,
            'message' => 'Account Successfully Created',
            'user' => [
                'id' => $userId,
                'username' => $username,
                'email' => $email,
            ],
            'tokens' => [
                'access_token' => self::createToken($userId),
            ],
        ];
    }
}
