<?php
session_start(); // Spustenie session na spracovanie správ
?>
<!DOCTYPE html>
<html lang="sk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prihlásenie</title>
    <link rel="stylesheet" href="styles/login.css">
    <style>
        .alert {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            padding: 15px 20px;
            border-radius: 5px;
            font-size: 1rem;
            font-weight: bold;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
            animation: fadeOut 5s forwards;
        }

        .alert.success {
            background-color: #4caf50;
            color: #fff;
        }

        .alert.error {
            background-color: #f44336;
            color: #fff;
        }

        @keyframes fadeOut {
            0% {
                opacity: 1;
            }
            80% {
                opacity: 1;
            }
            100% {
                opacity: 0;
                visibility: hidden;
            }
        }
    </style>
</head>
<body class="index-page">
    <header class="map-page">
        <h1 class="header-title">SO Air Quality Sprint App</h1>
        <nav class="navbar map-page">
            <a href="index.html" class="nav-link">Úvod</a>
            <a href="pocasie.html" class="nav-link">Počasie</a>
            <a href="mapa.html" class="nav-link">Mapa</a>
            <a href="profil.html" class="nav-link">Profil</a>
            <a href="login.php" class="nav-link active login-button">Login</a>
        </nav>
    </header>

    <?php
    // Zobrazenie správy po prihlásení
    if (isset($_SESSION['success'])) {
        echo "<div class='alert success'>{$_SESSION['success']}</div>";
        unset($_SESSION['success']);
    }
    if (isset($_SESSION['error'])) {
        echo "<div class='alert error'>{$_SESSION['error']}</div>";
        unset($_SESSION['error']);
    }
    ?>

    <main class="main-container">
        <section class="login-form">
            <h2>Prihlásenie</h2>
            <form action="backend/login.php" method="POST">
                <div class="form-group">
                    <label for="email">E-mail:</label>
                    <input type="email" id="email" name="email" placeholder="Váš e-mail" required>
                </div>
                <div class="form-group">
                    <label for="password">Heslo:</label>
                    <input type="password" id="password" name="password" placeholder="Vaše heslo" required>
                </div>
                <button type="submit" class="styled-button">Prihlásiť sa</button>
            </form>
            <p>Nemáte účet? <a href="register.php">Zaregistrujte sa</a></p>
        </section>
    </main>

    <footer class="index-page footer">
        <p>&copy; 2024 SO Air Quality Sprint App. Všetky práva vyhradené.</p>
    </footer>
</body>
</html>
