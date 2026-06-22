#!/bin/sh

echo "Ensure storage directories exist..."
mkdir -p storage/framework/views storage/framework/cache/data storage/framework/sessions storage/logs storage/app/public
chmod -R 775 storage bootstrap/cache

echo "Caching configuration..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Caching views..."
php artisan view:cache

echo "Caching events..."
php artisan event:cache

echo "Running migrations..."
php artisan migrate --force

echo "Starting FrankenPHP via Laravel Octane..."
exec php artisan octane:start --server=frankenphp --host=0.0.0.0 --port=8080 --admin-port=2021 --workers=auto
