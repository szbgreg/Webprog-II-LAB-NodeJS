var express = require("express");
var router = express.Router();
const { query } = require("../modules/db");

router.get("/", async function (req, res, next) {
  try {
    const page = parseInt(req.query.oldal) || 1;
    const limit = 15;
    const offset = (page - 1) * limit;

    const totalResult = await query(`SELECT COUNT(*) AS count FROM suti`);

    const total = totalResult[0].count;
    const totalPages = Math.ceil(total / limit);

    const sutik = await query(
      `SELECT * FROM suti ORDER BY id LIMIT ${limit} OFFSET ${offset}`
    );

    res.render("crud/sutik", {
      title: "CRUD Süti",
      sutik,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        total: total,
      },
    });
  } catch (err) {
    req.flash("error", "Hiba történt a süti lista lekérésekor!");
    res.redirect("/crud/sutik");
  }
});

router.get("/new", function (req, res, next) {
  res.render("crud/new-suti", { title: "Új süti hozzáadása" });
});

router.post("/", async function (req, res, next) {
  try {
    const { nev, tipus, dijazott } = req.body;
    const errors = {};

    if (!nev || nev.trim().length < 2) {
      errors.nev = "A név legalább 2 karakter kell legyen!";
    }

    if (!tipus || tipus.trim().length < 2) {
      errors.tipus = "A típus legalább 2 karakter kell legyen!";
    }

    if (
      typeof dijazott === "undefined" ||
      (dijazott !== "0" && dijazott !== "1")
    ) {
      errors.dijazott = "A díjazott mező értéke érvénytelen!";
    }

    if (Object.keys(errors).length > 0) {
      return res.render("crud/new-suti", {
        title: "Új süti hozzáadása",
        errors: errors,
        formData: { nev, tipus, dijazott },
      });
    }

    const mysqlQuery = `INSERT INTO suti (nev, tipus, dijazott, created_at, updated_at) VALUES ('${nev}', '${tipus}', '${dijazott}', NOW(), NOW())`;

    await query(mysqlQuery);

    req.flash("success", "Új süti sikeresen hozzáadva!");
    res.redirect("/crud/sutik");
  } catch (error) {
    req.flash("error", "Hiba történt a süti hozzáadása során!");
    res.redirect("/crud/sutik/new");
  }
});

router.post("/:id/delete", async function (req, res, next) {
  try {
    const sutiId = req.params.id;
    await query(`DELETE FROM suti WHERE id = ${sutiId}`);
    req.flash("success", "Süti sikeresen törölve!");
    res.redirect("/crud/sutik");
  } catch (error) {
    req.flash("error", "Hiba történt a süti törlése során!");
    res.redirect("/crud/sutik");
  }
});

router.get("/:id/edit", async function (req, res, next) {
  try {
    const sutiId = req.params.id;
    const results = await query(`SELECT * FROM suti WHERE id = ${sutiId}`);

    if (results.length === 0) {
      req.flash("error", "A megadott süti nem található!");
      return res.redirect("/crud/sutik");
    }

    const suti = results[0];
    res.render("crud/edit-suti", { title: "Süti szerkesztése", suti });
  } catch (error) {
    req.flash("error", "Hiba történt a süti lekérése során!");
    res.redirect("/crud/sutik");
  }
});

router.post("/:id/edit", async function (req, res, next) {
  try {
    const sutiId = req.params.id;
    const { nev, tipus, dijazott } = req.body;
    const errors = {};

    if (!nev || nev.trim().length < 2) {
      errors.nev = "A név legalább 2 karakter kell legyen!";
    }

    if (!tipus || tipus.trim().length < 2) {
      errors.tipus = "A típus legalább 2 karakter kell legyen!";
    }

    if (
      typeof dijazott === "undefined" ||
      (dijazott !== "0" && dijazott !== "1")
    ) {
      errors.dijazott = "A díjazott mező értéke érvénytelen!";
    }

    if (Object.keys(errors).length > 0) {
      const suti = { id: sutiId, nev, tipus, dijazott };
      return res.render("crud/edit-suti", {
        title: "Süti szerkesztése",
        errors: errors,
        suti: suti,
      });
    }

    const mysqlQuery = `UPDATE suti SET nev = '${nev}', tipus = '${tipus}', dijazott = '${dijazott}', updated_at = NOW() WHERE id = ${sutiId}`;

    await query(mysqlQuery);

    req.flash("success", "Süti sikeresen módosítva!");
    res.redirect("/crud/sutik");
  } catch (error) {
    req.flash("error", "Hiba történt a süti módosítása során!");
    res.redirect(`/crud/sutik/${req.params.id}/edit`);
  }
});

module.exports = router;
