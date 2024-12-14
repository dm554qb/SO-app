<?php
session_start();
require_once 'config.php';


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Získanie údajov z formulára
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    try {
        // Vyhľadanie používateľa podľa e-mailu
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();

        if ($user) {
            // Overenie hesla
            if (password_verify($password, $user['password'])) {
                // Prihlásenie úspešné
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['name'];
                $_SESSION['success'] = 'Prihlásenie bolo úspešné!';
                header('Location: ../index.php');
                exit;
            } else {
                $_SESSION['error'] = 'Nesprávne heslo.';
                header('Location: ../login.php');
                exit;
            }
        } else {
            $_SESSION['error'] = 'Používateľ s týmto e-mailom neexistuje.';
            header('Location: ../login.php');
            exit;
        }
    } catch (PDOException $e) {
        $_SESSION['error'] = 'Chyba pri prihlásení: ' . $e->getMessage();
        header('Location: ../login.php');
        exit;
    }
}
?>
