# Použitie oficiálneho PHP 8 obrazu s Apache
FROM php:8.1-apache

# Skopírovanie všetkých súborov do webového adresára
COPY . /var/www/html/

# Nastavenie pracovného adresára
WORKDIR /var/www/html

# Nastavenie oprávnení
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Povolenie rozšírení PHP potrebných pre PDO a MySQL
RUN docker-php-ext-install pdo pdo_mysql

# Port, ktorý Docker bude počúvať
EXPOSE 80

# Príkaz na spustenie Apache servera
CMD ["apache2-foreground"]
