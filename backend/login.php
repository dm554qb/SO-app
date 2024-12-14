<?php
require_once 'config.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    try {
        // Získanie používateľa podľa e-mailu
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        // Overenie používateľa a hesla
        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['success'] = 'Prihlásenie úspešné!';
            header('Location: ../index.html'); // Presmerovanie na hlavnú stránku
            exit;
        } else {
            $_SESSION['error'] = 'Nesprávne meno alebo heslo.';
            header('Location: ../login.php'); // Návrat na prihlasovaciu stránku
            exit;
        }
    } catch (PDOException $e) {
        $_SESSION['error'] = 'Chyba servera. Skúste to neskôr.';
        header('Location: ../login.php');
        exit;
    }
}
?>
