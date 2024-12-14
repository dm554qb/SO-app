<?php
require_once 'config.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    $pdo->exec($sql);
    echo "Tabuľka 'users' bola úspešne vytvorená.";
} catch (PDOException $e) {
    echo "Chyba pri vytváraní tabuľky: " . $e->getMessage();
}
?>
