<?php
require_once 'config.php'; // Pripojenie k databáze
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $confirmPassword = trim($_POST['confirm-password']);

    // Overenie hesiel
    if ($password !== $confirmPassword) {
        $_SESSION['error'] = 'Heslá sa nezhodujú. Skúste znova.';
        header('Location: ../register.php');
        exit;
    }

    // Hashovanie hesla
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    try {
        $stmt = $pdo->prepare('INSERT INTO users (name, email, password) VALUES (:name, :email, :password)');
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':password' => $hashedPassword
        ]);

        $_SESSION['success'] = 'Registrácia prebehla úspešne.';
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            $_SESSION['error'] = 'Používateľ s týmto e-mailom už existuje.';
        } else {
            $_SESSION['error'] = 'Chyba: ' . $e->getMessage();
        }
    }
    header('Location: ../register.php');
    exit;
}
?>
