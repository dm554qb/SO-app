<!DOCTYPE html>
<html lang="sk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrácia</title>
    <link rel="stylesheet" href="styles/login.css">
</head>
<body class="index-page">
    <header class="map-page">
        <h1 class="header-title">SO Air Quality Sprint App</h1>
        <nav class="navbar map-page">
            <a href="index.php" class="nav-link">Úvod</a>
            <a href="pocasie.php" class="nav-link">Počasie</a>
            <a href="mapa.php" class="nav-link">Mapa</a>
            <a href="profil.php" class="nav-link">Profil</a>
            <a href="login.php" class="nav-link login-button">Login</a>
        </nav>
    </header>

    <?php
    session_start();
    if (isset($_SESSION['success'])) {
        echo "<div class='overlay show' id='successMessage'>{$_SESSION['success']}</div>";
        unset($_SESSION['success']);
    }
    if (isset($_SESSION['error'])) {
        echo "<div class='alert error'>{$_SESSION['error']}</div>";
        unset($_SESSION['error']);
    }
    ?>

    <main class="main-container">
        <section class="login-form">
            <h2>Registrácia</h2>
            <form action="backend/register.php" method="POST">
                <div class="form-group">
                    <label for="name">Meno:</label>
                    <input type="text" id="name" name="name" placeholder="Vaše meno" required>
                </div>
                <div class="form-group">
                    <label for="email">E-mail:</label>
                    <input type="email" id="email" name="email" placeholder="Váš e-mail" required>
                </div>
                <div class="form-group">
                    <label for="password">Heslo:</label>
                    <input type="password" id="password" name="password" placeholder="Vaše heslo" required>
                </div>
                <div class="form-group">
                    <label for="confirm-password">Potvrdenie hesla:</label>
                    <input type="password" id="confirm-password" name="confirm-password" placeholder="Potvrďte heslo" required>
                </div>
                <button type="submit" class="styled-button">Zaregistrovať sa</button>
            </form>
            <p>Máte už účet? <a href="login.php">Prihláste sa</a></p>
        </section>
    </main>

    <footer class="index-page footer">
        <p>&copy; 2024 SO Air Quality Sprint App. Všetky práva vyhradené.</p>
    </footer>

    <script>
        // Automatické skrytie prekrytia po 5 sekundách
        setTimeout(() => {
            const overlay = document.getElementById('successMessage');
            if (overlay) {
                overlay.classList.remove('show');
            }
        }, 1250);
    </script>
</body>
</html>
