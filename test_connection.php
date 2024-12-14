<?php
require_once 'backend/config.php';


try {
    $stmt = $pdo->query('SELECT NOW() AS current_time');
    $row = $stmt->fetch();
    echo "Pripojenie úspešné! Aktuálny čas v databáze je: " . $row['current_time'];
} catch (PDOException $e) {
    echo "Chyba pri pripojení k databáze: " . $e->getMessage();
}
?>
