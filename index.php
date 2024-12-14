<!DOCTYPE html>
<html lang="sk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SO Air Quality Sprint App</title>
    <link rel="stylesheet" href="styles/index.css">
</head>
<body class="index-page">
    <header class="map-page">
        <h1 class="header-title">SO Air Quality Sprint App</h1>
        <nav class="navbar map-page">
            <a href="index.php" class="nav-link active">Úvod</a>
            <a href="pocasie.html" class="nav-link">Počasie</a>
            <a href="mapa.html" class="nav-link">Mapa</a>
            <a href="profil.html" class="nav-link">Profil</a>
            <a href="login.php" class="nav-link login-button">Login</a>
        </nav>
    </header>

    <?php
    session_start();
    // Zobrazenie úspešnej alebo chybovej správy
    if (isset($_SESSION['success'])) {
        echo '<div class="success-message">' . $_SESSION['success'] . '</div>';
        unset($_SESSION['success']);
    }
    if (isset($_SESSION['error'])) {
        echo '<div class="error-message">' . $_SESSION['error'] . '</div>';
        unset($_SESSION['error']);
    }
    ?>

    <main>
        <section class="intro-container index-page">
            <div class="text-content">
                <h2>Čistejší vzduch pri behaní?<br>Vyber si SO Air Quality Sprint App</h2>
                <p>
                    Predstav si appku, ktorá ťa pri behu naviguje trasou s najčistejším vzduchom.
                    Sleduje kvalitu ovzdušia v tvojom okolí a podľa toho ti navrhne najzdravšiu trasu.
                    Vyhneš sa oblastiam so smogom či prachom a môžeš behať v prostredí, ktoré chráni tvoje pľúca.
                    Tento prístup podporuje tvoju kondíciu a zároveň sa stará o tvoje zdravie - ideálny spoločník
                    pre každého, kto myslí na čistý vzduch pri športe.
                </p>
            </div>
            <div class="image-content">
                <img src="images/runner2.jpg" alt="Running person" class="intro-image">
            </div>
        </section>
    </main>
    <footer class="index-page footer">
        <p>&copy; 2024 SO Air Quality Sprint App. Všetky práva vyhradené.</p>
    </footer>

    <script>
        // Automatické skrytie správy po 5 sekundách
        setTimeout(() => {
            const message = document.querySelector('.success-message, .error-message');
            if (message) {
                message.style.display = 'none';
            }
        }, 5000); // 5000 ms = 5 sekúnd
    </script>
    
</body>
</html>
