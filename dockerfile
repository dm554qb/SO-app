# Použitie oficiálneho PHP obrazu s Apache
FROM php:8.1-apache

# Inštalácia rozšírení potrebných pre PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo_pgsql

# Skopírovanie všetkých súborov do webového adresára
COPY . /var/www/html/

# Nastavenie pracovného adresára
WORKDIR /var/www/html

# Nastavenie oprávnení
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Port, ktorý Docker bude počúvať
EXPOSE 80

# Príkaz na spustenie Apache servera
CMD ["apache2-foreground"]
