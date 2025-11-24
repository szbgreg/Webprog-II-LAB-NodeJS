var express = require("express");
const { query } = require("../modules/db");
var router = express.Router();

router.get("/", async function (req, res, next) {
  try {
    const page = parseInt(req.query.oldal) || 1;
    const limit = 15;
    const offset = (page - 1) * limit;

    // Összes süti lekérdezése a lapozáshoz
    const totalResult = await query(`SELECT COUNT(*) AS count FROM suti`);
    const total = totalResult[0].count;
    const totalPages = Math.ceil(total / limit);

    // 1. Sütik lekérdezése
    const sutik = await query(
      `SELECT * FROM suti ORDER BY id LIMIT ${limit} OFFSET ${offset}`
    );

    for (let suti of sutik) {
      // Tartalmak
      suti.tartalmak = await query(
        `SELECT * FROM tartalom WHERE sutiid = '${suti.id}'`
      );

      // Árak
      suti.arak = await query(
        `SELECT * FROM ar WHERE sutiid = '${suti.id}' ORDER BY ertek`
      );
    }

    const mentesMap = {
      G: "Gluténmentes",
      L: "Laktózmentes",
      HC: "Hozzáadott cukor nélkül",
      Te: "Tejmentes",
      To: "Tojásmentes",
      É: "Édesítőszerrel készült",
    };

    res.render("database", {
      title: "Süti adatbázis",
      sutik: sutik,
      mentesMap: mentesMap,
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
  } catch (error) {
    console.error("Hiba a sütik lekérdezésekor:", error);
    req.flash("error", "Hiba történt a sütik lekérdezésekor!");
    res.redirect("/");
  }
});

module.exports = router;
