<?php

require_once __DIR__ . '/env.php';

function appConfig(): array
{
    $jwtSecret = getenv('JWT_SECRET') ?: '';
    if ($jwtSecret === '' && getenv('APP_ENV') === 'production') {
        throw new RuntimeException('JWT_SECRET must be configured in production.');
    }

    return [
        'app_name' => getenv('APP_NAME') ?: 'LavaLust CRUD',
        'jwt_secret' => $jwtSecret ?: 'local-development-only-secret',
    ];
}
