var express = require("express");
var router = express.Router();
const { query } = require("../modules/db");
const { checkAdmin } = require("../modules/auth");

router.get("/users", checkAdmin, async function (req, res, next) {
  try {
    const users = await query("SELECT * FROM users");
    res.render("admin", { title: "Admin oldal", user: req.user, users: users });
  } catch (error) {
    req.flash("error", "Hiba történt a felhasználók lekérése során!");
    res.redirect("/");
  }
});

router.get("/users/:id/edit", checkAdmin, async function (req, res, next) {
  const userId = req.params.id;

  try {
    const users = await query(`SELECT * FROM users WHERE id = '${userId}'`);

    if (users.length === 0) {
      req.flash("error", "A felhasználó nem található!");
      return res.redirect("/admin/users");
    }

    const user = users[0];
    res.render("edit-user", {
      title: "Felhasználó szerkesztése",
      user: user,
      currentUser: req.session.user,
    });
  } catch (error) {
    req.flash("error", "Hiba történt a felhasználó lekérése során!");
    res.redirect("/admin/users");
  }
});

router.post("/users/:id/edit", checkAdmin, async function (req, res, next) {
  const userId = req.params.id;
  const { isAdmin } = req.body;

  try {
    const mysqlQuery = `UPDATE users SET isAdmin = '${isAdmin}'  WHERE id = '${userId}'`;
    await query(mysqlQuery);

    req.flash("success", "A felhasználó sikeresen frissítve lett!");
    res.redirect("/admin/users");
  } catch (error) {
    req.flash("error", "Hiba történt a felhasználó frissítése során!");
    res.redirect("/admin/users");
  }
});

module.exports = router;
