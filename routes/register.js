const express = require("express");
const router = express.Router();

const { query } = require("../modules/db");
const { genPassword } = require("../modules/auth");

router.get("/", (req, res, next) => {
  res.render("register", { title: "Regisztráció" });
});

router.post("/", async (req, res, next) => {
  const { username, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      req.flash("error", "A jelszavak nem egyeznek!");
      return res.redirect("/register");
    }

    if (password.length < 6) {
      req.flash("error", "A jelszó legalább 6 karakter kell legyen!");
      return res.redirect("/register");
    }

    const existingUser = await query(
      `SELECT * FROM users WHERE username = '${username}'`
    );

    if (existingUser.length > 0) {
      req.flash("error", "Ez a felhasználónév már foglalt!");
      return res.redirect("/register");
    }

    const sql = `INSERT INTO users (username, hash, isAdmin) 
                    VALUES ('${username}','${genPassword(password)}', 0)`;

    await query(sql);

    req.flash("success", "Sikeres regisztráció! Most már bejelentkezhetsz.");
    res.redirect("/login");
  } catch (error) {
    console.error("Regisztrációs hiba:", error);
    req.flash("error", "Hiba történt a regisztráció során!");
    res.redirect("/register");
  }
});

module.exports = router;
