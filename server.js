const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "secret_key", // Zmeňte na náhodný reťazec
    resave: false,
    saveUninitialized: false,
  })
);

// Databázové pripojenie
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "air_quality",
});

db.connect((err) => {
  if (err) {
    console.error("Chyba pri pripájaní k databáze:", err);
  } else {
    console.log("Pripojené k databáze MySQL.");
  }
});

// Registrácia
app.post("/register", async (req, res) => {
  const { first_name, last_name, email, phone, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const query =
    "INSERT INTO users (first_name, last_name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [first_name, last_name, email, phone, hashedPassword],
    (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          res.status(400).send("Email už existuje.");
        } else {
          res.status(500).send("Chyba na serveri.");
        }
      } else {
        res.status(200).send("Registrácia úspešná!");
      }
    }
  );
});

// Prihlásenie
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT id, password_hash FROM users WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      res.status(500).send("Chyba na serveri.");
    } else if (results.length === 0) {
      res.status(400).send("Nesprávny email alebo heslo.");
    } else {
      const isMatch = await bcrypt.compare(password, results[0].password_hash);

      if (isMatch) {
        req.session.user_id = results[0].id;
        res.status(200).send("Prihlásenie úspešné!");
      } else {
        res.status(400).send("Nesprávny email alebo heslo.");
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server beží na http://localhost:${PORT}`);
});
