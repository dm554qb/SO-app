<?php
$host = getenv('DB_HOST') ?: 'dpg-ctep9ctds78s73dig1mg-a';
$port = getenv('DB_PORT') ?: '5432';
$db = getenv('DB_NAME') ?: 'so_app_db';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: 'aMgebNacAGNmi08ZrRvEvl3BKqZmTZb6';
$charset = 'utf8';

$dsn = "pgsql:host=$host;port=$port;dbname=$db";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}
?>
