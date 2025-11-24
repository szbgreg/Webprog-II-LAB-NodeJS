const express = require("express");
const router = express.Router();
const { query } = require("../modules/db");

router.get("/", function (req, res, next) {
  res.render("contact", {
    title: "Kapcsolatfelvétel",
  });
});

router.post("/", async function (req, res, next) {
  try {
    const { name, email, message } = req.body;
    const errors = {};

    if (!name || name.trim().length < 2) {
      errors.name = "A név legalább 2 karakter kell legyen!";
    }

    if (!email || !email.includes("@")) {
      errors.email = "Érvényes e-mail címet adj meg!";
    }

    if (!message || message.trim().length < 10) {
      errors.message = "Az üzenet legalább 10 karakter kell legyen!";
    }

    if (Object.keys(errors).length > 0) {
      return res.render("contact", {
        title: "Kapcsolatfelvétel",
        errors: errors,
        formData: { name, email, message },
      });
    }

    const mysqlQuery = `INSERT INTO messages (sender_name, sender_email, content, created_at, updated_at) VALUES ('${name}', '${email}', '${message}', NOW(), NOW())`;

    await query(mysqlQuery);

    req.flash("success", "Köszönjük az üzeneted! Hamarosan válaszolunk.");
    res.redirect("/contact");
  } catch (error) {
    console.error("Hiba az üzenet mentésekor:", error);
    req.flash("error", "Hiba történt az üzenet mentésekor!");
    res.redirect("/contact");
  }
});

module.exports = router;
