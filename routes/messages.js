var express = require("express");
var router = express.Router();
const { query } = require("../modules/db");
const { checkAuth } = require("../modules/auth");

router.get("/", checkAuth, async function (req, res, next) {
  try {
    const messages = await query(
      "SELECT * FROM messages ORDER BY created_at DESC"
    );

    res.render("messages", {
      title: "Beérkezett üzenetek",
      messages: messages,
    });
  } catch (err) {
    console.error("Hiba:", err);
    req.flash("error", "Hiba történt!");
    res.redirect("/messages");
  }
});

module.exports = router;
