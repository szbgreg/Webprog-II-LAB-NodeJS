const express = require("express");
const router = express.Router();

const { query } = require("../modules/db");
const { genPassword } = require("../modules/auth");

router.get("/", (req, res, next) => {
  res.render("register", { title: "Regisztráció" });
});

router.post("/", async (req, res, next) => {
  const { username, password } = req.body;
  const sql = `
        INSERT INTO users (username, hash, isAdmin)
        VALUES ('${username}', '${genPassword(password)}', 0)`;
  await query(sql);

  res.send("register sent");
});

module.exports = router;
