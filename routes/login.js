const express = require("express");
const router = express.Router();

const { query } = require("../modules/db");
const { genPassword } = require("../modules/auth");

router.get("/", (req, res, next) => {
  res.render("login", { title: "Belépés" });
});

router.post("/", async (req, res, next) => {
  const { username, password } = req.body;
  const sql = `
        SELECT * FROM users
        WHERE username='${username}'
        AND hash='${genPassword(password)}'
    `;

  const users = await query(sql);
  if (users.length === 1) {
    req.session.user = users[0];
    res.redirect("/");
  } else {
    req.flash("error", "Hibás felhasználónév vagy jelszó!");
    res.redirect("/login");
  }
});

module.exports = router;
