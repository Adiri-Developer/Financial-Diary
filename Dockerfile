FROM dunglas/frankenphp:php8.2

# Install required PHP extensions
RUN install-php-extensions \
    pdo_mysql \
    pdo_pgsql \
    mbstring \
    pcntl \
    bcmath \
    gd \
    zip \
    opcache

# Install Node.js, npm, and other essential tools
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install PHP dependencies (no-dev for production)
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Install Node dependencies and build assets
RUN npm install --legacy-peer-deps && npm run build

# Copy OPcache configuration
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# Set permissions for Laravel
RUN chmod -R 775 storage bootstrap/cache

# Expose port 8080
EXPOSE 8080

# Setup entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
