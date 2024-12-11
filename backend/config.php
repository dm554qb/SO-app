<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "so_app";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Pripojenie zlyhalo: " . $conn->connect_error);
}
?>
