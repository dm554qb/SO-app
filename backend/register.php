<?php
require_once 'config.php';
session_start();


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


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $confirm_password = trim($_POST['confirm-password']);

    // Validácia hesla
    if ($password !== $confirm_password) {
        $_SESSION['error'] = 'Heslá sa nezhodujú.';
        header('Location: ../register.php');
        exit;
    }

    // Hashovanie hesla
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    try {
        // Kontrola, či e-mail už existuje
        $stmt = $pdo->prepare('SELECT COUNT(*) FROM users WHERE email = :email');
        $stmt->execute(['email' => $email]);
        $emailExists = $stmt->fetchColumn();

        if ($emailExists > 0) {
            $_SESSION['error'] = 'E-mail už existuje.';
            header('Location: ../register.php');
            exit;
        }

        // Vloženie nového používateľa
        $stmt = $pdo->prepare('INSERT INTO users (name, email, password) VALUES (:name, :email, :password)');
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':password' => $hashedPassword
        ]);

        $_SESSION['success'] = 'Registrácia úspešná! Teraz sa môžete prihlásiť.';
        header('Location: ../login.php');
        exit;

    } catch (PDOException $e) {
        $_SESSION['error'] = 'Chyba pri registrácii: ' . $e->getMessage();
        header('Location: ../register.php');
        exit;
    }
}
?>
